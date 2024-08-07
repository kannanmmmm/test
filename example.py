import pandas as pd

# Load the Excel file
file_path = 'Sugarcane QP.xlsx'
excel_data = pd.read_excel(file_path)

# Convert the Excel data to a JSON object
questions_list = []
for index, row in excel_data.iterrows():
    question_data = {
        "question": row['Questions'],
        "options": row[['Option1', 'Option2', 'Option3', 'Option4']].tolist(),
        "answer": row['Answer']  # Assuming the answer is in the same format as the index of options
    }
    questions_list.append(question_data)

# Save the JSON data to a file
json_path = 'question.json'
with open(json_path, 'w') as json_file:
    json.dump(questions_list, json_file, indent=4)
    
questions_list    
