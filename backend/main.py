from fastapi import FastAPI, UploadFile, File, Query
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
import pandas as pd
import io
import numpy as np
import re

app = FastAPI()
@app.get("/")
async def root():
    return {"status": "ok", "message": "Backend is running"}

# Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple rule-based categorization
def categorize(description: str) -> str:
    rules = {
        "Food & Dining": ["starbucks", "coffee"],
        "Shopping": ["amazon", "target"],
        "Transportation": ["uber", "lyft"],
        "Health & Wellness": ["gym", "fitness"],
        "Subscriptions": ["netflix", "spotify"],
    }
    desc = description.lower()
    for category, keywords in rules.items():
        if any(keyword in desc for keyword in keywords):
            return category
    return "Uncategorized"

def apply_categorization(df):
    # Helper: is category unassigned
    def is_category_unassigned(row):
        return (pd.isnull(row['category']) or row['category'] == '' or row['category'] == 'Unclassified')

    # Helper: update category by regex pattern
    def update_category(pattern, category):
        mask = df.apply(is_category_unassigned, axis=1) & df['narration'].str.contains(pattern, na=False)
        df.loc[mask, 'category'] = category

    # All patterns from your notebook
    update_category(r'stonewain.*pay|pay.*stonewain', 'Salary')
    update_category(r'stonewain.*park|park.*stonewain|parking', 'Parking')
    update_category(r'fuel|car|harpreet bhar|irctc|cm auto|cab|cycle|train|alto|fronx|toll|transport', 'Transport')
    update_category(r'dinner|lunch|icecream|pizza|cake|haldiram|zomato|swiggy|tea|fries|kheer|dosa|royal sweet|snack|jamun|kulcha|chaat|gappe|gappa|momo|food|juice|shake|donut|soup|restaurant', 'Eat out')
    update_category(r'manavmangalsmartscho', 'Child Education')
    update_category(r'fiffin', 'Essentials')
    update_category(r'paytmiccl|indianesign|indian clearing corp|ppf|fd through mobile|investment', 'Investments')
    update_category(r'sewerage|jtpl|resident welfare', 'Society Maintenance')
    update_category(r'insurance', 'Insurance')
    update_category(r'grocery|smart bazaar|blinkit|vegetable|sweet|fruit|mandeep kumar|sunscreen|rakhi|indane|veg|onion|egg|fish|chicken|curd|boondi|paneer|mirch|pepper|bread|apple|banana|orange|anaar|grape|oil|flour|aata|atta|milk|jaggery|all out|chawal|dal', 'Grocery')
    update_category(r'shoe|cloth|towel|jean|shirt|flipflop|myntra|crocs', 'Clothing')
    update_category(r'atm|atw', 'Cash Withdrawal')
    update_category(r'transfer', 'Fund Transfer')
    update_category(r'medicine|lab tests|tabs', 'Medicals')
    update_category(r'hair cut|salon|beard|gym', 'Self Care')
    update_category(r'airtel|jio|internet|air fiber', 'Internet/Subscriptions')
    update_category(r'door|pot|mirror|table|repair|urbancompany|ac service|inverter|bath|lamp|pspcl|water tank|wire|pure it|paint|racks|wash basin|gutter|capacitor|grass|appliance', 'House Maintenance')
    update_category(r'ib billpay dr-hdfc92|si-tad', 'Credit Card')
    update_category(r'book', 'Learning & Development')
    update_category(r'bookmyshow|gadget|toy|ride|cracker|travel', 'Entertainment')
    update_category(r'birthday|gift', 'Gifts')
    update_category(r'reimbursement', 'Reimbursement')

    # If debit amount < 200 and > 0 and still unassigned, set as Grocery
    if 'debit amount' in df.columns:
        mask = (df['debit amount'] < 200) & (df['debit amount'] > 0) & df.apply(is_category_unassigned, axis=1)
        df.loc[mask, 'category'] = 'Grocery'

    # Fill blanks/NaN with 'Unclassified'
    df['category'] = df['category'].replace('', np.nan).fillna('Unclassified')

    return df

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    limit: int = Query(20, ge=1, le=100),   # default 20, max 100
    offset: int = Query(0, ge=0)
):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    # Preprocessing: lowercase/strip columns
    df.columns = [col.strip().lower() for col in df.columns]
    df = df.apply(lambda x: x.str.strip().str.lower() if x.dtype == 'object' else x)

    # Clean narration column (if present)
    if 'narration' in df.columns:
        df['narration'] = df['narration'].str.replace(r'\d+', '', regex=True)
        df['narration'] = df['narration'].str.replace(r'[^a-z\s]', ' ', regex=True)
        terms_to_remove = ['upi', 'okicici', 'gpay']
        pattern = '|'.join(terms_to_remove)
        df['narration'] = df['narration'].str.replace(pattern, '', regex=True)
        df['narration'] = df['narration'].str.strip()

    # Remove rows where 'debit amount' is 0 (if present)
    if 'debit amount' in df.columns:
        df = df[df['debit amount'] != 0]

    # Remove rows where 'narration' contains 'tax' (if present)
    if 'narration' in df.columns:
        df = df[~df['narration'].str.contains('tax', na=False)]

    df.reset_index(drop=True, inplace=True)

    # Add a new column 'category' if not present
    if 'category' not in df.columns:
        df['category'] = None

    # Only apply categorization if 'narration' column exists
    if 'narration' in df.columns:
        df = apply_categorization(df)
    else:
        # fallback: use rule-based on description if present
        desc_col = 'description' if 'description' in df.columns else None
        if desc_col:
            df['category'] = df[desc_col].apply(categorize)
        else:
            df['category'] = 'Uncategorized'

    df = apply_categorization(df)

    # Replace NaN and inf with None for JSON serialization
    df.replace([np.nan, np.inf, -np.inf], None, inplace=True)

    # PAGINATION LOGIC
    total = len(df)
    paginated_df = df.iloc[offset:offset+limit]
    transactions = paginated_df.to_dict(orient="records")

    amount_col = 'amount' if 'amount' in df.columns else ('debit amount' if 'debit amount' in df.columns else None)
    if amount_col:
        summary_df = df.groupby("category")[amount_col].sum().reset_index()
        summary_df.replace([np.nan, np.inf, -np.inf], None, inplace=True)
        category_summary = summary_df.to_dict(orient="records")
    else:
        category_summary = []

    return JSONResponse(
        {
            "transactions": transactions,
            "category_summary": category_summary,
            "total": total,
            "limit": limit,
            "offset": offset,
        }
    )

@app.post("/monthly_trend")
async def monthly_trend(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))
    df.columns = [col.strip().lower() for col in df.columns]
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        df['month'] = df['date'].dt.to_period('M').astype(str)
        amount_col = 'amount' if 'amount' in df.columns else ('debit amount' if 'debit amount' in df.columns else None)
        if amount_col:
            monthly = df.groupby('month')[amount_col].sum().reset_index()
            monthly = monthly.replace([np.nan, np.inf, -np.inf], None)
            return JSONResponse(monthly.to_dict(orient='records'))
    return JSONResponse([])

@app.post("/monthly_category_breakdown")
async def monthly_category_breakdown(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))
    df.columns = [col.strip().lower() for col in df.columns]
    if 'date' in df.columns and 'category' in df.columns:
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        df['month'] = df['date'].dt.to_period('M').astype(str)
        amount_col = 'amount' if 'amount' in df.columns else ('debit amount' if 'debit amount' in df.columns else None)
        if amount_col:
            pivot = df.pivot_table(index='month', columns='category', values=amount_col, aggfunc='sum', fill_value=0).reset_index()
            pivot = pivot.replace([np.nan, np.inf, -np.inf], None)
            return JSONResponse(pivot.to_dict(orient='records'))
    return JSONResponse([])

@app.post("/top_merchants")
async def top_merchants(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))
    df.columns = [col.strip().lower() for col in df.columns]
    desc_col = 'description' if 'description' in df.columns else 'narration'
    amount_col = 'amount' if 'amount' in df.columns else ('debit amount' if 'debit amount' in df.columns else None)
    if desc_col and amount_col:
        top = df.groupby(desc_col)[amount_col].sum().abs().reset_index().sort_values(amount_col, ascending=False).head(10)
        top = top.replace([np.nan, np.inf, -np.inf], None)
        return JSONResponse(top.to_dict(orient='records'))
    return JSONResponse([])

@app.post("/income_vs_expense")
async def income_vs_expense(file: UploadFile = File(...)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))
    df.columns = [col.strip().lower() for col in df.columns]
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        df['month'] = df['date'].dt.to_period('M').astype(str)
        amount_col = 'amount' if 'amount' in df.columns else ('debit amount' if 'debit amount' in df.columns else None)
        if amount_col:
            df['income'] = df[amount_col].apply(lambda x: x if x > 0 else 0)
            df['expense'] = df[amount_col].apply(lambda x: -x if x < 0 else 0)
            monthly = df.groupby('month')[['income', 'expense']].sum().reset_index()
            monthly = monthly.replace([np.nan, np.inf, -np.inf], None)
            return JSONResponse(monthly.to_dict(orient='records'))
    return JSONResponse([])
