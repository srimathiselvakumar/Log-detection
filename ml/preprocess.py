import pandas as pd

df = pd.read_csv("../data/logs.csv")

df.fillna(0, inplace=True)
df['event_type'] = df['event_type'].astype('category').cat.codes
df['status'] = df['status'].astype('category').cat.codes
df['ip'] = df['ip'].astype('category').cat.codes

X = df[['event_type','status','ip','response_time','user_id']]
X.to_csv("../data/features.csv", index=False)
