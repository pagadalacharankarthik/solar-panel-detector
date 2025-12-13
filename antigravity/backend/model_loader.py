import torch
import torchvision
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.models.detection.mask_rcnn import MaskRCNNPredictor
import os

def get_model_instance_segmentation(num_classes):
    # load an instance segmentation model pre-trained on COCO
    model = torchvision.models.detection.maskrcnn_resnet50_fpn(weights="DEFAULT")

    # get number of input features for the classifier
    in_features = model.roi_heads.box_predictor.cls_score.in_features
    # replace the pre-trained head with a new one
    model.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes)

    # now get the number of input features for the mask classifier
    in_features_mask = model.roi_heads.mask_predictor.conv5_mask.in_channels
    hidden_layer = 256
    # and replace the mask predictor with a new one
    model.roi_heads.mask_predictor = MaskRCNNPredictor(in_features_mask,
                                                       hidden_layer,
                                                       num_classes)
    return model

def load_model(model_path: str, device: torch.device):
    """
    Loads the trained model weights. 
    If weights are not found, returns a model with random weights (or initialized COCO weights) 
    so the app doesn't crash, but warns heavily.
    """
    num_classes = 2 # Background + Solar Panel
    model = get_model_instance_segmentation(num_classes)
    
    if os.path.exists(model_path):
        print(f"Loading model weights from {model_path}")
        model.load_state_dict(torch.load(model_path, map_location=device))
    else:
        print(f"WARNING: Model weights not found at {model_path}. Using base COCO weights (predictions will be nonsense).")
    
    model.to(device)
    model.eval()
    
    # CRITICAL FIX: Lower the model's internal score threshold
    # By default, Mask R-CNN filters out predictions below 0.05
    # For a demo model trained on limited data, we need to see ALL predictions
    model.roi_heads.score_thresh = 0.01  # Lower from default 0.05
    model.roi_heads.nms_thresh = 0.5     # Keep NMS threshold reasonable
    
    return model
