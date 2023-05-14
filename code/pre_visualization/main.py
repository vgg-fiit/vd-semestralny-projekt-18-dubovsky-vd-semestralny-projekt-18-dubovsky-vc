import glob
import json

from db import Directory
from misc import dfs_traverse, connect, insert_word_list
from neomodel import config, db, StructuredNode, Relationship





dataset_path = "C:\\Users\\gazik\\Documents\\FIIT_SS_2022\\DV\\dataset"
if __name__ == "__main__":

    config.DATABASE_URL = 'neo4j+s://f2f239a6.databases.neo4j.io'


    global_word_list = []

    root = Directory(name='root', fullpath='root', keywords=[]).save()

    # Recursively get all files in dataset_path
    files = glob.glob(dataset_path + "\\**\\*fullpath.json", recursive=True)
    print(files)
    # Open each file and json.load it
    files_one = [files[0]]
    for file in files:
        path = file.replace("\\", "/")
        with open(path, "r", encoding="utf-8") as f:
            print (path)
            data = json.load(f)



            filename = path.split("/")[-1]


            # Concatenate meta_dict with data
            flat_list, wordlist = dfs_traverse(data, root, filename)
            global_word_list += wordlist
            connect(flat_list)
    # Remove duplicates from global_word_list
    global_word_list = list(set(global_word_list))

    insert_word_list(global_word_list, flat_list)

    # query = """  MATCH (dx)-[r:CONTAINS]->() return  dx,r LIMIT 100  """
    #
    # results, meta = db.cypher_query(query)
    #
    # # Convert the results to a list of dictionaries
    # # json_results = [{"p": to_dict(p), "f": to_dict(f), "q": to_dict(q)} for p, f, q in results]
    # print()
    # # Print the JSON output
    # # json_results = [{"node": to_dict(r[0]), "relationship": to_dict(r[1])} for r in results]
    # out = {"nodes": [], "relationships": []}
    # for r in results:
    #     node = {
    #         "id": r[0].id,
    #         ""
    #         "properties": r[0].__dict__['_properties'],
    #     }
    #
    #     rel = {
    #         "start": r[1].start_node.id,
    #         "end": r[1].end_node.id,
    #                 }
    #     out['nodes'].append(node)
    #     out["relationships"].append(rel)



    # json.dump(out, open("results.json", "w"), indent=2)



    # print(json.dumps(json_results, indent=2))

