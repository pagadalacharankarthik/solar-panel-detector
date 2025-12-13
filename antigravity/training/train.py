import os
import torch
import torchvision.transforms as T
from model_architecture import get_model_instance_segmentation
from dataset_preprocess import SolarDataset
from evaluation import evaluate_iou
import datetime

# Helper for transform
def get_transform(train):
    transforms = []
    transforms.append(T.ToTensor())
    # Note: Removed RandomHorizontalFlip because standard torchvision transforms don't flip bounding boxes.
    # To use flipping, we would need custom transforms or albumentations.
    # if train:
    #     transforms.append(T.RandomHorizontalFlip(0.5))
    return T.Compose(transforms)

def main():
    # settings
    device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
    num_classes = 2 # background + solar
    num_epochs = 10
    batch_size = 2
    learning_rate = 0.005
    
    # Dataset
    # Assuming dataset is extracted to ./antigravity/dataset_train and ./antigravity/dataset_valid
    train_dir = os.path.join(os.path.dirname(__file__), "..", "dataset_train")
    valid_dir = os.path.join(os.path.dirname(__file__), "..", "dataset_valid")
    
    if not os.path.exists(train_dir):
        print(f"Training dataset not found at {train_dir}.")
        return

    dataset = SolarDataset(train_dir, get_transform(train=True))
    dataset_test = SolarDataset(valid_dir, get_transform(train=False))

    # Remove manual split since we have folders
    data_loader = torch.utils.data.DataLoader(
        dataset, batch_size=batch_size, shuffle=True,  collate_fn=lambda x: tuple(zip(*x)))

    data_loader_test = torch.utils.data.DataLoader(
        dataset_test, batch_size=1, shuffle=False, collate_fn=lambda x: tuple(zip(*x)))

    # Model
    model = get_model_instance_segmentation(num_classes)
    model.to(device)

    # Optimizer
    params = [p for p in model.parameters() if p.requires_grad]
    optimizer = torch.optim.SGD(params, lr=learning_rate,
                                momentum=0.9, weight_decay=0.0005)
    # LR Scheduler
    lr_scheduler = torch.optim.lr_scheduler.StepLR(optimizer,
                                                   step_size=3,
                                                   gamma=0.1)

    # Logging
    if not os.path.exists("logs"):
        os.makedirs("logs")
        
    log_file = os.path.join("logs", f"training_log_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.csv")
    with open(log_file, 'w') as f:
        f.write("epoch,loss,iou\n")

    print("Starting training...")
    for epoch in range(num_epochs):
        model.train()
        epoch_loss = 0
        i = 0
        for images, targets in data_loader:
            images = list(image.to(device) for image in images)
            targets = [{k: v.to(device) for k, v in t.items()} for t in targets]

            loss_dict = model(images, targets)
            losses = sum(loss for loss in loss_dict.values())

            optimizer.zero_grad()
            losses.backward()
            optimizer.step()
            
            epoch_loss += losses.item()
            i += 1
            if i % 10 == 0:
                print(f"Epoch: {epoch}, Iter: {i}, Loss: {losses.item()}")

        lr_scheduler.step()
        
        # Evaluate
        iou = evaluate_iou(model, data_loader_test, device)
        
        # Log
        avg_loss = epoch_loss / len(data_loader)
        with open(log_file, 'a') as f:
            f.write(f"{epoch},{avg_loss},{iou}\n")
            
        print(f"Epoch {epoch} finished. Loss: {avg_loss}, IoU: {iou}")

        # Save Checkpoint
        if (epoch + 1) % 5 == 0:
            torch.save(model.state_dict(), f"../backend/models/antigravity_model_ep{epoch}.pt")

    # Save Final
    output_path = "../backend/models/antigravity_model.pt"
    output_dir = os.path.dirname(output_path)
    if not os.path.exists(output_dir):
        print(f"Creating directory {output_dir}")
        os.makedirs(output_dir)
        
    torch.save(model.state_dict(), output_path)
    print(f"Model saved to {output_path}")

if __name__ == "__main__":
    main()
