import torch
import numpy as np

def evaluate_iou(model, data_loader, device):
    """
    Simple IoU evaluation loop.
    """
    model.eval()
    ious = []
    
    with torch.no_grad():
        for images, targets in data_loader:
            images = list(img.to(device) for img in images)
            outputs = model(images)
            
            for i, output in enumerate(outputs):
                gt_masks = targets[i]['masks'].cpu().numpy()
                pred_masks = output['masks'].cpu().numpy()
                scores = output['scores'].cpu().numpy()
                
                # Take top prediction
                if len(pred_masks) > 0 and scores[0] > 0.5:
                    pred_mask = pred_masks[0, 0] > 0.5
                    gt_mask = gt_masks[0] if len(gt_masks) > 0 else np.zeros_like(pred_mask)
                    
                    intersection = np.logical_and(pred_mask, gt_mask).sum()
                    union = np.logical_or(pred_mask, gt_mask).sum()
                    
                    if union > 0:
                        ious.append(intersection / union)
                    else:
                        ious.append(0.0)
    
    mean_iou = np.mean(ious) if ious else 0.0
    print(f"Mean IoU: {mean_iou}")
    return mean_iou
