import pandas as pd
import os

# THREADS TO TRENDS
# DATA CLEANING PIPELINE

RAW_PATH = "dataset/raw"
OUTPUT_PATH = "dataset/processed"
def load_raw_data():
    all_data = []
    for file in os.listdir(RAW_PATH):
        if file.endswith(".csv"):
            file_path = os.path.join(
                RAW_PATH,
                file
            )
            print(f"Loading: {file}")
            df = pd.read_csv(file_path)
            all_data.append(df)
    merged_df = pd.concat(
        all_data,
        ignore_index=True
    )
    return merged_df

def clean_data(df):
    print("\nBefore Cleaning:")
    print("Rows:", df.shape[0])
    print("Columns:", df.shape[1])

    # Remove duplicate businesses

    if "Name" in df.columns:
        df = df.drop_duplicates(
            subset=["Name"]
        )

    # Remove empty names

    df = df.dropna(
        subset=["Name"]
    )

    # Clean ratings

    if "Average Rating" in df.columns:

        df["Average Rating"] = pd.to_numeric(
            df["Average Rating"],
            errors="coerce"
        )
    if "Review Count" in df.columns:
        df["Review Count"] = pd.to_numeric(
            df["Review Count"],
            errors="coerce"
        )
        df["Review Count"] = (
            df["Review Count"]
            .fillna(0)
        )
    print("\nAfter Cleaning:")
    print("Rows:", df.shape[0])
    print("Columns:", df.shape[1])
    return df

def save_clean_data(df):
    os.makedirs(
        OUTPUT_PATH,
        exist_ok=True
    )
    df.to_csv(
        "dataset/processed/cleaned_boutiques.csv",
        index=False
    )
    print(
        "\nCleaned dataset saved successfully 🔥"
    )
if __name__ == "__main__":

    data = load_raw_data()

    clean = clean_data(data)

    save_clean_data(clean)