import pandas as pd
import os

DATA_PATH = "dataset/final/boutique_intelligence.csv"
REPORT_PATH = "reports"

def load_data():
    return pd.read_csv(DATA_PATH)

def generate_insights(df):
    insights = {}

    # Total businesses
    insights["Total Businesses"] = len(df)

    # Average Rating
    insights["Average Rating"] = round(
        df["Average Rating"].mean(),
        2
    )

    # Businesses without website
    no_website = (
        df["Has_Website"] == 0
    ).sum()
    insights["Without Website"] = no_website
    insights["Without Website %"] = round(
        no_website / len(df) * 100,
        2
    )

    # Top opportunities
    top = (
        df.sort_values(
            "Opportunity_Score",
            ascending=False
        )
        .head(10)
    )
    return insights, top

def save_reports(insights, top):
    os.makedirs(
        REPORT_PATH,
        exist_ok=True
    )
    pd.DataFrame(
        insights.items(),
        columns=[
            "Metric",
            "Value"
        ]
    ).to_csv(
        "reports/project_summary.csv",
        index=False
    )
    top.to_excel(
        "reports/top_10_opportunities.xlsx",
        index=False
    )
    print("\n🔥 Project Summary")
    for k,v in insights.items():
        print(k,":",v)
    print(
        "\nTop 10 Opportunity Report Generated"
    )
if __name__=="__main__":
    df = load_data()
    insights,top = generate_insights(df)
    save_reports(
        insights,
        top
    )