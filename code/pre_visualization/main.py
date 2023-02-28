import glob
import json
from misc import dfs_traverse

dataset_path = "C:\\Users\\gazik\\Documents\\FIIT_SS_2022\\DV\\dataset"
if __name__ == "__main__":
    # Recursively get all files in dataset_path
    files = glob.glob(dataset_path + "\\**\\*fullpath.json", recursive=True)
    print(files)
    # Open each file and json.load it
    for file in files:
        path = file.replace("\\", "/")
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            # Depth first search through the dictionary via contents key
            dfs_traverse(data)
