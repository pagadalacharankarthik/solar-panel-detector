import os
import torch
import torch.utils.data
from PIL import Image
import json
import numpy as np

import os
import torch
import torch.utils.data
from PIL import Image, ImageDraw
import numpy as np

class SolarDataset(torch.utils.data.Dataset):
    def __init__(self, root, transforms=None):
        self.root = root
        self.transforms = transforms
        self.imgs = list(sorted(os.listdir(os.path.join(root, "images"))))
        self.labels = list(sorted(os.listdir(os.path.join(root, "labels"))))

    def __getitem__(self, idx):
        # Load Image
        img_path = os.path.join(self.root, "images", self.imgs[idx])
        label_path = os.path.join(self.root, "labels", self.labels[idx])
        
        img = Image.open(img_path).convert("RGB")
        w, h = img.size
        
        # Parse YOLO Polygon TXT
        # Format: <class_id> <x1> <y1> <x2> <y2> ... (normalized)
        boxes = []
        masks_list = []
        
        if os.path.exists(label_path):
            with open(label_path, 'r') as f:
                lines = f.readlines()
                
            for line in lines:
                parts = list(map(float, line.strip().split()))
                class_id = int(parts[0])
                coords = parts[1:]
                
                # Convert normalized coords to pixel coords
                # pairs of (x, y)
                poly_points = []
                x_coords = []
                y_coords = []
                
                for i in range(0, len(coords), 2):
                    px = coords[i] * w
                    py = coords[i+1] * h
                    poly_points.append((px, py))
                    x_coords.append(px)
                    y_coords.append(py)
                
                if len(poly_points) < 3:
                     continue

                # Bounding Box
                xmin = min(x_coords)
                xmax = max(x_coords)
                ymin = min(y_coords)
                ymax = max(y_coords)
                
                # Loose box filtering
                if xmax <= xmin or ymax <= ymin:
                    continue

                boxes.append([xmin, ymin, xmax, ymax])
                
                # Create Binary Mask for this object
                mask_img = Image.new('L', (w, h), 0)
                ImageDraw.Draw(mask_img).polygon(poly_points, outline=1, fill=1)
                masks_list.append(np.array(mask_img))

        # Handle images with no objects
        if len(boxes) == 0:
            # Mask R-CNN expects at least one background box or empty tensors with correct shapes
            # Correct way for empty:
            boxes = torch.zeros((0, 4), dtype=torch.float32)
            labels = torch.zeros((0,), dtype=torch.int64)
            masks = torch.zeros((0, h, w), dtype=torch.uint8)
            area = torch.zeros((0,), dtype=torch.float32)
            iscrowd = torch.zeros((0,), dtype=torch.int64)
        else:
            boxes = torch.as_tensor(boxes, dtype=torch.float32)
            labels = torch.ones((len(boxes),), dtype=torch.int64) # Class 1 for Solar
            masks = np.stack(masks_list, axis=0)
            masks = torch.as_tensor(masks, dtype=torch.uint8)
            area = (boxes[:, 3] - boxes[:, 1]) * (boxes[:, 2] - boxes[:, 0])
            iscrowd = torch.zeros((len(boxes),), dtype=torch.int64)

        image_id = torch.tensor([idx])

        target = {}
        target["boxes"] = boxes
        target["labels"] = labels
        target["masks"] = masks
        target["image_id"] = image_id
        target["area"] = area
        target["iscrowd"] = iscrowd

        if self.transforms is not None:
            img = self.transforms(img)

        return img, target

    def __len__(self):
        return len(self.imgs)
