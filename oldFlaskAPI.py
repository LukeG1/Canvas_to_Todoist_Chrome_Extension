from flask import Flask, redirect, request, jsonify
from datetime import datetime, timedelta
from pytodoist import todoist
from canvasapi import Canvas
import random
import json


app = Flask(__name__)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
fileData = []


def updateTodoist(todoist_email, todoist_password, canvas_url, canvas_api_key, system_time, data):
    global fileData
    #establish time
    today = str(datetime.today()).split(" ")[0]
    tDate = datetime(int(today.split("-")[0]), int(today.split("-")[1]), int(today.split("-")[2])).timestamp()
    #establish canvas
    try:
        canvas = Canvas(canvas_url, canvas_api_key)
        user = canvas.get_current_user()
        courses = user.get_courses()
    except:
        return 1
    # establish todoist
    try:
        user = todoist.login(todoist_email, todoist_password)
    except:
        return 2
    projectsTemp = user.get_projects()
    names = []
    projects = {}
    projectsList = []
    for project in projectsTemp:
        projects.update({project.name:project})
        projectsList.append([project.name,project])
    #establish data
    fileData=json.loads(data)

    for task in fileData:
        # check for expired
        #print(task[2])
        aDate = datetime(int(task[2].split("-")[0]), int(task[2].split("-")[1]), int(task[2].split("-")[2])).timestamp()
        if(aDate<tDate):
            fileData.remove(task)

    tasksAddedCount = 0
    fullAssignments = []
    for course in courses:
        print(course.name)
        for assignment in course.get_assignments():
            try:
                tDate2 = datetime.utcnow()
                d = str(system_time).split(" ")[0]
                t = str(system_time).split(" ")[1]
                system_time = datetime(int(d.split("-")[0]), int(d.split("-")[1]), int(d.split("-")[2]), int(t.split(":")[0]), int(t.split(":")[1]), round(float(t.split(":")[2])))
                offset = (tDate2-system_time)
                if(str(tDate2-system_time)[0]=="-"):
                    offset = (system_time-tDate)
                d = str(assignment.due_at_date).split(" ")[0]
                t = str(assignment.due_at_date).split(" ")[1]
                due_date_UTC = datetime(int(d.split("-")[0]), int(d.split("-")[1]), int(d.split("-")[2]), int(t.split(":")[0]), int(t.split(":")[1]), int(t.split(":")[2].split("+")[0]))
                aDate = (due_date_UTC-offset).timestamp()

                if(aDate>=tDate):
                    flag = False
                    for task in fileData:
                        if(str(task[1]) == str(assignment.name)):
                            flag = True
                    if(flag):
                         break
                    tempData = [course.name,assignment.name,str(datetime.fromtimestamp(aDate)).split(" ")[0]]
                    projects[tempData[0]].add_task(content = tempData[1], date = tempData[2])
                    fullAssignments.append(tempData)
                    fileData.append(tempData)
                    tasksAddedCount += 1
            except:
                pass

    return [tasksAddedCount,fileData]



@app.route('/', methods=['GET', 'POST'])
def home():
    global fileData
    if(request.method == 'POST'):
        somejson = json.loads(request.get_data())#request.get_json()
        try:
            output = updateTodoist(
                todoist_email = str(somejson['todoist_email']),
                todoist_password = str(somejson['todoist_password']),
                canvas_url = str(somejson['canvas_url']),
                canvas_api_key = str(somejson['canvas_api_key']),
                system_time = str(somejson['system_time']),
                data = str(somejson['data'])
                )
        except:
            output = 3
        if(output==1):
            return jsonify(json.dumps(1)), 201   #'Check your canvas credientials'
        if(output==2):
            return jsonify(json.dumps(2)), 201   #'Check your todoist credientials'
        if(output==3):
            return jsonify(json.dumps(3)), 201   #'Ensure That you have incuded credientials to send'
        if(output[1]==json.loads(somejson['data'])):
            #print('No new Tasks added')
            return jsonify(json.dumps(0)), 201   #'No new Tasks added'
        return jsonify(json.dumps(output)), 201
        #return jsonify(fileData), 201
        #return "<h1>Canvas to Todoist API</h1>"
    else:
        return "<h1>Canvas to Todoist API</h1>"


if __name__ == '__main__':
    app.run(debug=True)










