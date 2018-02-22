from flask import Flask, render_template, jsonify, redirect
from flask import jsonify
import csv
import json
import sqlite3 as sql
import pandas as pd  
# from __future__ import print_function
import sys
import time


app = Flask(__name__)
app.debug=True


def scoredata(uPopulation,uOver_65,uRent,uHome_Price,uAssistance,wPopulation,wOver_65,wRent,wHome_Price,wAssistance):
# def scoredata():
    import json
    import sqlite3 as sql
    import numpy as np
    import pandas as pd  

    conn = sql.connect("./Datasets/RetirementDB.sqlite")

    c = conn.cursor()

    conn.execute("DELETE from CityProfile")
    conn.commit()

    data = []
    with open('./retiredb.json') as f:
        data=list(json.load(f).items())

    for row in data:    
        query = "insert into CityProfile values ("+\
        "'"+row[1]["City"]+"',"+\
        "'"+row[1]["State"]+"',"+\
        "'"+row[1]["Zipcode"]+"',"+\
        str(row[1]["Rank"])+","+\
        str(row[1]["Population"])+","+\
        str(row[1]["Over_65"])+","+\
        str(row[1]["Rent"])+","+\
        str(row[1]["Home_Price"])+","+\
        str(row[1]["Assistance"])+","+\
        str(row[1]["Latitude"])+","+\
        str(row[1]["Longitude"])+","+\
        "'"+row[1]["URL"]+"')"
        print(query)
        c.execute(query)
        conn.commit()

    ## Calculate Score
    import math

    print("Running actual engine using input:")
    print(uPopulation)
    print(uOver_65)
    print(uRent)
    print(uHome_Price)
    print(uAssistance)

    print(wPopulation)
    print(wOver_65)
    print(wRent)
    print(wHome_Price)
    print(wAssistance)


    #1 Get Standardized Value
    #1.1 Calc Mean
    citylist=conn.execute("SELECT count(*) cntRow,avg(Population) avgPopulation,avg(Over_65) avgOver_65,avg(Rent) avgRent,avg(Home_Price) avgHome_Price,avg(Assistance) avgAssistance from CityProfile")
    for avgrow in citylist:
        avgrow[0]    

    RowCount=avgrow[0]  
    meanPopulation=avgrow[1]
    meanOver_65=avgrow[2]
    meanRent=avgrow[3]
    meanHome_Price=avgrow[4]
    meanAssistance=avgrow[5]


    #1.2 Calc Standard Dev
    citylist=conn.execute("SELECT 1, Population,Over_65,Rent,Home_Price,Assistance from CityProfile")
    rPopulation=0
    rOver_65=0
    rRent=0
    rHome_Price=0
    rAssistance=0
    for row in citylist:
        rPopulation=rPopulation+(row[1]-meanPopulation)**2
        rOver_65=rOver_65+(row[2]-meanOver_65)**2
        rRent=rRent+(row[3]-meanRent)**2
        rHome_Price=rHome_Price+(row[4]-meanHome_Price)**2
        rAssistance=rAssistance+(row[5]-meanAssistance)**2

    stdvPopulation=math.sqrt(rPopulation/RowCount)
    stdvOver_65=math.sqrt(rOver_65/RowCount)
    stdvRent=math.sqrt(rRent/RowCount)
    stdvHome_Price=math.sqrt(rHome_Price/RowCount)
    stdvAssistance=math.sqrt(rAssistance/RowCount)
        
    # 2 Apply Euclidean/Mahalanobis Distance Measure    
    print("Starting Euclid")
    print(uPopulation)
    print(meanPopulation)
    print(stdvPopulation)
    zuPopulation=(uPopulation-meanPopulation)/stdvPopulation
    zuOver_65=(uOver_65-meanOver_65)/stdvOver_65
    zuRent=(uRent-meanRent)/stdvRent
    zuHome_Price=(uHome_Price-meanHome_Price)/stdvHome_Price
    zuAssistance=(uAssistance-meanAssistance)/stdvAssistance
    print("Completed first part")

    cityscore=[]
    citylist=conn.execute("SELECT 1, Population,Over_65,Rent,Home_Price,Assistance,City, State, \
                                Latitude,Longitude,URL,ZipCode,USNewsRank from CityProfile")
    for row in citylist:

        cPopulation=row[1]
        cOver_65=row[2]
        cRent=row[3]
        cHome_Price=row[4]
        cAssistance=row[5]

        
        zcPopulation=(cPopulation-meanPopulation)/stdvPopulation
        zcOver_65=(cOver_65-meanOver_65)/stdvOver_65
        zcRent=(cRent-meanRent)/stdvRent
        zcHome_Price=(cHome_Price-meanHome_Price)/stdvHome_Price
        zcAssistance=(cAssistance-meanAssistance)/stdvAssistance
               
        # Cal Distance Score
        
        score=math.sqrt(((zuPopulation-zcPopulation)*wPopulation)**2+   \
                        ((zuOver_65-zcOver_65)*wOver_65)**2+   \
                        ((zuRent-zcRent)*wRent)**2+   \
                        ((zuHome_Price-zcHome_Price)*wHome_Price)**2+   \
                        ((zuAssistance-zcAssistance)*wAssistance)**2   \
                        )
        print("Score: "+row[6]+"  "+row[7]+" "+str(score))

        cityscore.append((row[6],row[7],row[8],row[9],row[10], \
                        uPopulation,uOver_65,uRent,uHome_Price,uAssistance, \
                        zuPopulation,zuOver_65,zuRent,zuHome_Price,zuAssistance, \
                        cPopulation,cOver_65,cRent,cHome_Price,cAssistance, \
                        zcPopulation,zcOver_65,zcRent,zcHome_Price,zcAssistance, \
                        score,row[11],row[12]))

    conn.execute("DELETE from CityProfileScored")
    conn.commit()
                        
    for row in cityscore:
        query = "insert into CityProfileScored values ("+\
        "'"+row[0]+"',"+\
        "'"+row[1]+"',"+\
        str(row[2])+","+\
        str(row[3])+","+\
        "'"+row[4]+"',"+\
        str(row[5])+","+\
        str(row[6])+","+\
        str(row[7])+","+\
        str(row[8])+","+\
        str(row[9])+","+\
        str(row[10])+","+\
        str(row[11])+","+\
        str(row[12])+","+\
        str(row[13])+","+\
        str(row[14])+","+\
        str(row[15])+","+\
        str(row[16])+","+\
        str(row[17])+","+\
        str(row[18])+","+\
        str(row[19])+","+\
        str(row[20])+","+\
        str(row[21])+","+\
        str(row[22])+","+\
        str(row[23])+","+\
        str(row[24])+","+\
        str(row[25])+","+\
        str(row[26])+","+\
        str(row[27])+")"
        print(query)
        c.execute(query)
        conn.commit()     

    #Get Top 5 Cities
    conn.execute("drop table Top5CityState")
    conn.commit()

    conn.execute("create table Top5CityState as SELECT CityProfileScored.*, \
    (SELECT COUNT()+1 FROM (SELECT DISTINCT Score FROM CityProfileScored AS t WHERE Score < CityProfileScored.Score) \
    ) AS RtrmtRank, USNewsTop100.Img,USNewsTop100.Link,CrimeData.CrimeRate \
    FROM CityProfileScored \
         left join USNewsTop100 on trim(CityProfileScored.City)=trim(USNewsTop100.City) and trim(CityProfileScored.State)=trim(USNewsTop100.State) \
         left join CrimeData on trim(CityProfileScored.City)=trim(CrimeData.City) and trim(CityProfileScored.State)=trim(CrimeData.State) \
		 Where RtrmtRank<=5  \
    order by RtrmtRank") 
    
    conn.commit()

    return 1




@app.route("/")
def index():    
    
    return render_template("index.html")

@app.route("/score/<ScoreParam>")
def score(ScoreParam):
    print("Start Scoring Engine")
    print(ScoreParam)
    uList = ScoreParam.split(",")

    puPopulation=float(uList[0])
    puOver_65=float(uList[1])
    puRent=float(uList[2])
    puHome_Price=float(uList[3])
    puAssistance=float(uList[4])
    pwPopulation=float(uList[5])
    pwOver_65=float(uList[6])
    pwRent=float(uList[7])
    pwHome_Price=float(uList[8])
    pwAssistance=float(uList[9])
 
    scr=scoredata(puPopulation,puOver_65,puRent,puHome_Price,puAssistance,pwPopulation,pwOver_65,pwRent,pwHome_Price,pwAssistance)

    conn = sql.connect("./Datasets/RetirementDB.sqlite")
    c = conn.cursor()
    c.execute("select * from Top5CityState")

    component = c.fetchall()
    top5=[]
    for row in component:
        top5.append((row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7],row[8],row[9],row[10],row[11],row[12], \
        row[13],row[14],row[15],row[16],row[17],row[18],row[19],row[20],row[21],row[22],row[23],row[24],row[25],row[26], \
        row[27],row[28],row[29],row[30],row[31]))    

    top5_df = pd.DataFrame(top5, columns=["City","State","Latitude","Longitude","URL","uPopulation", \
                                            "uOver_65","uRent","uHome_Price","uAssistance","zuPopulaton", \
                                            "zuOver_65","zuRent","zuHome_Price","zuAssistance","cPopulation", \
                                            "cOver_65","cRent","cHome_Price","cAssistance","zcPopulation", \
                                            "zcOver_65","zcRent","zcHome_Price","zcAssistance", \
                                            "Score","ZipCode","USNewsRank","RtrmtRank","Img","Link","CrimeRate"])
    top5_df.head()  
    top5_df.to_json(orient='records')
    top5_dict=top5_df.to_json(orient='records')    
    return json.dumps(top5_dict)


@app.route("/usmap/")
def usmap():  
    time.sleep(5) 
    conn = sql.connect("./Datasets/RetirementDB.sqlite")
    c = conn.cursor()


    # c.execute("select City,State,Latitude,Longitude,Score from CityProfileScored")
    c.execute("SELECT CityProfileScored.City,CityProfileScored.State,CityProfileScored.Latitude,CityProfileScored.Longitude,CityProfileScored.Score, \
    (SELECT COUNT()+1 FROM (SELECT DISTINCT Score FROM CityProfileScored AS t WHERE Score < CityProfileScored.Score) \
    ) AS RtrmtRank \
    FROM CityProfileScored \
    order by RtrmtRank")

    component = c.fetchall()
    allcities=[]
    for row in component:
        allcities.append((row[0],row[1],row[2],row[3],row[4],row[5]))    

    allcities_df = pd.DataFrame(allcities, columns=["City","State","Latitude","Longitude","Score","RtrmtRank"])
    allcities_df.head()  
    allcities_df.to_json(orient='records')
    allcities_dict=allcities_df.to_json(orient='records')  
    return json.dumps(allcities_dict)

if __name__ == "__main__":

    app.run(debug=True)