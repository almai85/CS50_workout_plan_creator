import db_helper

my_dict = db_helper.create_exercises_dict()

values_list = list(my_dict.values())
keys_list = list(my_dict.keys())


value_indexes = [i for i in range(0, len(values_list)) if "Pecs" in values_list[i]]
searched_exercises = [keys_list[i] for i in value_indexes]


my_list = ["Fleisch und Suppe", "Fleisch"]

print("Suppe" in "Fleisch und Suppe")