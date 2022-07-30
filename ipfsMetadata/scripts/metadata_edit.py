import json
import os

ipfs_image_base_uri = "ipfs://bafybeidgywe755zmmvd52kobsyrd6drxm4qk2uarhitl6ae7xpizvbwp3i/"
image_root_folder = r"../Images"
json_root_folder = r"../json"
print(os.getcwd())
for image_filename in os.listdir(image_root_folder):
    json_filename = image_filename.split("_")[0]
    print(json_filename)
    json_file_path = os.path.join(json_root_folder, json_filename)
    json_file = open(json_file_path, "r")
    json_obj = json.load(json_file)
    json_file.close()
    ipfs_uri = os.path.join(ipfs_image_base_uri, image_filename)
    json_obj["image"].append(ipfs_uri)
    print(json_obj)
    try:
        with open(json_file_path, "w") as outfile:
            outfile.write(json.dumps(json_obj, indent = 1))
    except Error as e:
        print(e)
    

