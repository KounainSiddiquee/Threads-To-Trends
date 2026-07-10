import pandas as pd
import numpy as np

INPUT_PATH = "dataset/processed/cleaned_boutiques.csv"
OUTPUT_PATH = "dataset/final/boutique_intelligence.csv"

def normalize(series):
    if series.max() == series.min():
        return series
    return (
        (series - series.min())
        /
        (series.max() - series.min())
    )

def calculate_opportunity():
    df = pd.read_csv(INPUT_PATH)

    # RATING STRENGTH

    df["Rating_Score"] = (
        normalize(df["Average Rating"])
        *
        100
    )

    # REVIEW POPULARITY

    df["Review_Score"] = (
        normalize(
            np.log1p(df["Review Count"])
        )
        *
        100
    )

    # DIGITAL GAP

    df["Website_Gap"] = (
        1 - df["Has_Website"]
    ) * 100
    
    df["Social_Gap"] = (
        1 - df["Has_Instagram"]
    ) * 100

    # FINAL OPPORTUNITY SCORE

    df["Opportunity_Score"] = (
        df["Rating_Score"] * 0.25
        +
        df["Review_Score"] * 0.20
        +
        df["Website_Gap"] * 0.35
        +
        df["Social_Gap"] * 0.20
    ).round(2)

    # BUSINESS SEGMENTS

    def segment(score):
        if score >= 75:
            return "Hidden Gem"
        elif score >= 55:
            return "Growth Potential"
        elif score >= 35:
            return "Digital Leader"
        else:
            return "Low Priority"

    df["Business_Segment"] = (
        df["Opportunity_Score"]
        .apply(segment)
    )
    # AI RECOMMENDATION

    def recommendation(row):
        ideas=[]

        if row["Has_Website"] == 0:
            ideas.append(
                "Create website & online catalogue"
            )

        if row["Has_Instagram"] == 0:
            ideas.append(
                "Improve Instagram marketing"
            )

        if row["Average Rating"] >= 4.5:
            ideas.append(
                "Promote strong customer reputation"
            )
        return " | ".join(ideas)

    df["AI_Recommendation"] = (
        df.apply(
            recommendation,
            axis=1
        )
        )






    df.to_csv(
        OUTPUT_PATH,
        index=False
    )



    print(
        "🔥 Boutique Intelligence Dataset Created Successfully"
    )





if __name__ == "__main__":

    calculate_opportunity()