from flask import Flask, request, jsonify
from flask_cors import CORS  
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

# Load dataset
df = pd.read_csv('haircare1.csv')

# Normalize DataFrame columns and data
df['Hair_Type'] = df['Hair_Type'].str.strip().str.lower()
df['Hair_Issue'] = df['Hair_Issue'].str.strip().str.lower()

@app.route('/recommend', methods=['POST'])
def recommend():
    user_input = request.json

    # Log raw user input
    app.logger.info(f"Raw User Input: {user_input}")

    # Normalize user input
    hair_type = user_input.get('hairType', '').strip().lower()
    hair_concerns = [concern.strip().lower() for concern in user_input.get('hairConcerns', [])]

    app.logger.info(f"Normalized User Input: Hair Type: {hair_type}, Hair Concerns: {hair_concerns}")

    # Filter the DataFrame based on normalized input
    recommendations = df[
        (df['Hair_Type'] == hair_type) &
        (df['Hair_Issue'].isin(hair_concerns))
    ]

    # Log filtered recommendations
    app.logger.info(f"Filtered Recommendations:\n{recommendations}")

    # Check if recommendations are available
    if recommendations.empty:
        return jsonify({"message": "No recommendations found for the provided input."})
    
    # Extract recommended products and care tips
    result = recommendations[['Recommended_Product', 'Care_Tip']].drop_duplicates().to_dict(orient='records')
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
