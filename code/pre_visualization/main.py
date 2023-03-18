import glob
import json
from misc import dfs_traverse, connect
from neomodel import config, db, StructuredNode, Relationship





dataset_path = "C:\\Users\\gazik\\Documents\\FIIT_SS_2022\\DV\\dataset"
if __name__ == "__main__":

    config.DATABASE_URL = 'bolt://neo4j:ajopajo@localhost:7687/files'

    # # Recursively get all files in dataset_path
    # files = glob.glob(dataset_path + "\\**\\*fullpath.json", recursive=True)
    # print(files)
    # # Open each file and json.load it
    # for file in files[:1]:
    #     path = file.replace("\\", "/")
    #     with open(path, "r", encoding="utf-8") as f:
    #         print (path)
    #         data = json.load(f)
    #         # Concatenate meta_dict with data
    #         flat_list, last_id, wordlist = dfs_traverse(data, 1)
    #         connect(flat_list)
    #

    query = """  MATCH (dx)-[r:CONTAINS]->() return  dx,r LIMIT 100  """

    results, meta = db.cypher_query(query)

    # Convert the results to a list of dictionaries
    # json_results = [{"p": to_dict(p), "f": to_dict(f), "q": to_dict(q)} for p, f, q in results]
    print()
    # Print the JSON output
    # json_results = [{"node": to_dict(r[0]), "relationship": to_dict(r[1])} for r in results]
    out = {"nodes": [], "relationships": []}
    for r in results:
        node = {
            "id": r[0].id,
            ""
            "properties": r[0].__dict__['_properties'],
        }

        rel = {
            "start": r[1].start_node.id,
            "end": r[1].end_node.id,
                    }
        out['nodes'].append(node)
        out["relationships"].append(rel)



    json.dump(out, open("results.json", "w"), indent=2)



    # print(json.dumps(json_results, indent=2))

