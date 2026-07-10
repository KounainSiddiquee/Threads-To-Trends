import pandas as pd
import numpy as np
import os

INPUT_FILE = "dataset/processed/cleaned_boutiques.csv"
OUTPUT_FOLDER = "dataset/final"

def load_data():

    return pd.read_csv(INPUT_FILE)
def create_features(df):

    # Website Availability

    df["Has_Website"] = df["Website"].notna().astype(int)

    # Instagram Availability

    if "Instagram" in df.columns:
        df["Has_Instagram"] = (
            df["Instagram"]
            .notna()
            .astype(int))
    else:
        df["Has_Instagram"] = 0



    # Phone Availability
    df["Has_Phone"] = (
        df["Phone"]
        .notna()
        .astype(int)
    )

    # Popularity Score

    df["Popularity_Score"] = (
        df["Average Rating"].fillna(0)
        *
        np.log1p(
            df["Review Count"]
        )
    )

    # Digital Score

    df["Digital_Score"] = (
        df["Has_Website"] * 50
        +
        df["Has_Instagram"] * 30
        +
        df["Has_Phone"] * 20
    )

    # Opportunity Score
    df["Opportunity_Score"] = (
        df["Popularity_Score"]
        *
        (100 - df["Digital_Score"])
    )

    # Normalize

    df["Opportunity_Score"] = (
        df["Opportunity_Score"]
        /
        df["Opportunity_Score"].max()
        *
        100
    ).round(2)

    # Segment Businesses


    def segment(row):
        if (
            row["Opportunity_Score"] >= 70):

            return "Hidden Gem"

        elif (
            row["Digital_Score"] >= 70):
            return "Digital Leader"

        elif (
            row["Opportunity_Score"] >=40):
            return "Growth Potential"
        else:
            return "Low Priority"

    df["Business_Segment"] = df.apply(
        segment,
        axis=1)
    return df

def save_data(df):
    os.makedirs(
        OUTPUT_FOLDER,
        exist_ok=True
    )
    df.to_csv(
        "dataset/final/boutique_intelligence.csv",
        index=False
    )
    print("🔥 Intelligence Dataset Created Successfully")
    print("\nSegments:")
    print(
        df["Business_Segment"]
        .value_counts()
    )
if __name__=="__main__":
    data = load_data()
    final = create_features(data)
    save_data(final)