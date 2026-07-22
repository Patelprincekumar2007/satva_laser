"""
Batch remove Gemini watermark from all frame images.
The watermark is a 4-point star icon in the bottom-right corner.
Strategy: crop all frames by ~5% from the right and bottom edges,
then resize back to original dimensions. This removes the watermark
cleanly while preserving the cinematic content.
"""
from PIL import Image
import os
import sys

FRAMES_DIR = os.path.join('public', 'frames')
TOTAL_FRAMES = 357

# Crop percentages (remove from edges)
CROP_RIGHT_PCT = 0.08   # 8% from right
CROP_BOTTOM_PCT = 0.06  # 6% from bottom
CROP_LEFT_PCT = 0.01    # 1% from left (balance)
CROP_TOP_PCT = 0.01     # 1% from top (balance)

processed = 0
errors = 0

for i in range(1, TOTAL_FRAMES + 1):
    filename = f'frame_{str(i).zfill(4)}.jpg'
    filepath = os.path.join(FRAMES_DIR, filename)
    
    if not os.path.exists(filepath):
        print(f'  SKIP: {filename} not found')
        errors += 1
        continue
    
    try:
        img = Image.open(filepath)
        w, h = img.size
        
        # Calculate crop box (left, upper, right, lower)
        left = int(w * CROP_LEFT_PCT)
        top = int(h * CROP_TOP_PCT)
        right = int(w * (1 - CROP_RIGHT_PCT))
        bottom = int(h * (1 - CROP_BOTTOM_PCT))
        
        # Crop and resize back to original dimensions
        cropped = img.crop((left, top, right, bottom))
        resized = cropped.resize((w, h), Image.LANCZOS)
        
        # Save back (overwrite)
        resized.save(filepath, 'JPEG', quality=92)
        processed += 1
        
        if processed % 50 == 0:
            print(f'  Processed {processed}/{TOTAL_FRAMES} frames...')
            
    except Exception as e:
        print(f'  ERROR: {filename} - {e}')
        errors += 1

print(f'\nDone! Processed: {processed}, Errors: {errors}')
