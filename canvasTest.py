from pytodoist import todoist
from datetime import datetime
from canvasapi import Canvas
import json

#Required data
todoist_email = 'EMAIL'
todoist_password = 'PASSWORD'
canvas_url = "CANVAS URL"
canvas_api_key = "CANVAS API KEY"
#establish time
today = str(datetime.today()).split(" ")[0]
tDate = datetime(int(today.split("-")[0]), int(today.split("-")[1]), int(today.split("-")[2])).timestamp()
#establish canvas
canvas = Canvas(canvas_url, canvas_api_key)
user = canvas.get_current_user()
courses = user.get_courses()
# establish todoist
user = todoist.login(todoist_email, todoist_password)
projectsTemp = user.get_projects()
names = []
projects = {}
projectsList = []
for project in projectsTemp:
    projects.update({project.name:project})
    projectsList.append([project.name,project])
#establish data
fileData = []
fPath = "PATH FOR FILE"
with open(fPath, "r") as read_file:
    fileData = json.load(read_file)

for task in fileData:
    # check for expired
    #print(task[2])
    aDate = datetime(int(task[2].split("/")[0]), int(task[2].split("/")[1]), int(task[2].split("/")[2])).timestamp()
    if(aDate<tDate):
        fileData.remove(task)

fullAssignments = []
for course in courses:
    print(course.name)
    for assignment in course.get_assignments():
        try:
            a = str(assignment.due_at_date).split(" ")[0]
            aDate = datetime(int(a.split("-")[0]), int(a.split("-")[1]), int(a.split("-")[2])).timestamp()
            if(aDate>=tDate):
                flag = False
                for task in fileData:
                    if(str(task[1]) == str(assignment.name)):
                        flag = True
                if(flag):
                     break
                tempData = [course.name,assignment.name,str(assignment.due_at_date).split(" ")[0].replace("-","/")]
                projects[tempData[0]].add_task(content = tempData[1], date = tempData[2])
                fullAssignments.append(tempData)
                fileData.append(tempData)
        except:
            pass
with open(fPath, 'w') as outfile:
    json.dump(fileData, outfile, indent=4)


    


