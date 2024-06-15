import json
import boto3

# process course details based on intent
def processCourseDetails(event, courseDetails):
    intent = event['sessionState']['intent']['name']
    slots = event['sessionState']['intent']['slots']
    CC = slots['CourseCode']['value']['originalValue'].upper()

    if intent == 'CourseElectivesList':
        courseElectives = courseDetails.get('CourseElectives', {}).get('L', [])
        CE_List = []

        for CE in courseElectives:
            CE = CE.get('M', {})
            # checking fields not empty
            subject_code = CE.get('SubjectCode', {}).get('S')
            subject_name = CE.get('SubjectName', {}).get('S')
            if subject_code and subject_name:
                CE_List.append(CE)

        confirmation_text = "Here are all the Course Electives available for {} \n".format(CC)
        dot_point_list = ""

        for CE in CE_List:
            dot_point_list += f"{CE['SubjectCode']} : {CE['SubjectName']}\n"
        print("CE LIST",CE_List)
        reformatted_response = {'heading_message': confirmation_text, 'subjects_list':  json.dumps(CE_List)}

        return reformatted_response


    if intent == 'CourseElectivesIn':
        courseElectives = courseDetails.get('CourseElectives', {}).get('L', [])
        CE_List = []
        sem_no = slots['SemNo']['value']['interpretedValue']

        for CE in courseElectives:
            CE = CE['M']
            # checking required fields not empty
            if CE.get('Available'):
                sem_word = "sem"+sem_no
                if sem_word in CE['Available']['S']:
                    CE_List.append(CE)

        confirmation_text = "Here are all the Course Electives in "+CC +", available in semester " + str(sem_no)


        reformatted_response = {'heading_message': confirmation_text, 'subjects_list':  json.dumps(CE_List)}

        return reformatted_response


    if intent == 'SemSubjects':
        SemSublist = []
        semSubs = courseDetails.get('CourseStructure', {}).get('L', [])  # Get the list of subjects

        if not semSubs:
            return "No course structure found."

        print('Received slots:', slots)

        # Extract semester and year from slots
        semester_slot = slots.get('SemSem', {}).get('value', {}).get('originalValue')
        year_slot = slots.get('SemYear', {}).get('value', {}).get('originalValue')

        if not semester_slot or not year_slot:
            return "Semester or year slots are missing or empty."

        semester = int(semester_slot[0]) if semester_slot[0].isdigit() else None
        year = int(year_slot[0]) if year_slot[0].isdigit() else None

        if semester is None or year is None:
            return "Semester or year value is not valid."

        # Filter subjects based on semester and year
        filtered_subjects = [subject['M'] for subject in semSubs if 'Semester' in subject['M'] and 'Year' in subject['M']
                             and int(subject['M']['Semester']['N']) == semester and int(subject['M']['Year']['N']) == year]

        print('The filtered Subjects', filtered_subjects)

        response_message = "Here are the " + CC + " subjects for semester " + str(semester) + " of year " + str(year) + ":"

        for item in filtered_subjects:
            subjects = item.get('Subjects', {}).get('L', [])
            for subject in subjects:
                subject_info = subject.get('M', {})
                subject_name = subject_info.get('SubjectName', {}).get('S', 'Unknown Subject')
                subject_code = subject_info.get('SubjectCode', {}).get('S', 'Unknown Code')
                subject_link = subject_info.get('SubjectLink', {}).get('S', 'Unknown Link')
                print(subject_name)
                if subject_code and subject_name:
                    SemSublist.append(subject_info)
                    print("Sub Info", subject_info)

        reformatted_response = {'heading_message': response_message, 'subjects_list': json.dumps(SemSublist)}

        return reformatted_response


    if intent == 'UniElective':
        semester_to_filter = slots.get('SemSem', {}).get('value', {}).get('originalValue', None)
        print("semesterrr:", semester_to_filter)
        print("semesterrr type:", type(semester_to_filter))

        if not semester_to_filter or not semester_to_filter.isdigit():
            return "Semester slot is missing, empty, or invalid."

        semester_to_filter = int(semester_to_filter)

        uniElectsList = []
        uniElects = courseDetails.get('UniElectives', {}).get('L', [])  # Get the list of subjects

        if not uniElects:
            return "No uni electives found in course."

        for UE in uniElects:
            elective_info = UE.get('M', {})
            subject_name = elective_info.get('SubjectName', {}).get('S', 'Unknown Subject')
            semester = elective_info.get('Semester', {}).get('N', None)

            print("Semester", semester)

            if subject_name and semester and int(semester) == semester_to_filter:
                uniElectsList.append(elective_info)

        if not uniElectsList:
            return f"No uni electives found for Semester {semester_to_filter}."

        response_message = f"Here are the UniElectives for Semester {semester_to_filter}:"
        # Return the list of elective details
        reformatted_response = {'heading_message': response_message, 'subjects_list': json.dumps(uniElectsList)}
        return reformatted_response


    if intent == 'CoreCourses':
        CoreCourseslist = []
        coreCourses = courseDetails.get('CourseStructure', {}).get('L', [])  # Get the list of subjects

        if not coreCourses:
            return "No course structure found."

        for courses in coreCourses:
            courses = courses.get('M', {})
            # checking fields not empty
            subject_code = courses.get('SubjectCode', {}).get('S')
            subject_name = courses.get('SubjectName', {}).get('S')
            if subject_code and subject_name:
                CoreCourseslist.append(courses)

        confirmation_text = "Here are all the Core Courses  for {} \n".format(CC)
        dot_point_list = ""


        print("Core course List",CoreCourseslist)
        reformatted_response = {'heading_message': confirmation_text, 'subjects_list':  json.dumps(CoreCourseslist)}

        return reformatted_response




    if intent == 'CourseElectivesNoA':
        courseElectives = courseDetails['CourseElectives']['L']  # Assuming courseElectives is of List type
        subject_codes = []
        subject_names = []
        CE_List = []
        Task_A = slots['Task_A']['value']['interpretedValue']

        print("Task A: ", Task_A)
        print("courselectives: ", courseElectives)

        for CE in courseElectives:
            CE = CE['M']
            # checking feilds not empty
            if CE['SubjectCode'].get('S') and CE['SubjectCode'].get('S') and CE['Assignments'].get('L'):

                assignments = CE['Assignments']['L']
                print("assignment list:", assignments)

                # Flag to track if Task A is found in any assignment
                task_found = False
                for A in assignments:
                    A = A['M']
                    # warning i am not checking assignment type even exists, i am assuming it does
                    print("huh-",A['AssignmentType']['S'])
                    if Task_A in A['AssignmentType']['S']:
                        print("exam found in: ",CE['SubjectName']['S'] )
                        task_found = True
                        break
                if not task_found:
                    CE_List.append(CE)
                    subject_code = CE['SubjectCode']['S']  # Assuming 'SubjectCode' is stored as string
                    subject_codes.append(subject_code)
                    subject_name = CE['SubjectName']['S']
                    subject_names.append(subject_name)

        print(subject_codes)
        confirmation_text = "Here are all the Course Electives in " + CC+", with NO "+Task_A+" assignments in them: \n"
        dot_point_list = ""
        for code, name in zip(subject_codes, subject_names):
            dot_point_list += f"- {code} : {name}\n"

        reformatted_response = { 'heading_message' : confirmation_text, 'subjects_list' : json.dumps(CE_List)}

        return reformatted_response


    if intent == 'CourseElectivesWithA':
        courseElectives = courseDetails['CourseElectives']['L']  # Assuming courseElectives is of List type

        Task_A = slots['Task_A']['value']['interpretedValue']
        CE_with_A = []  # List to store course electives with the specified assignment

        print("Task A: ", Task_A)
        print("courselectives: ", courseElectives)

        for CE in courseElectives:
            CE = CE['M']
            # checking fields not empty
            if CE.get('SubjectCode') and CE.get('SubjectName') and CE.get('Assignments'):

                assignments = CE['Assignments']['L']
                print("assignment list:", assignments)

                for A in assignments:
                    A = A['M']
                    # warning I am not checking if the assignment type even exists, I am assuming it does
                    print("huh-", A['AssignmentType']['S'])
                    if Task_A in A['AssignmentType']['S']:
                        CE_with_A.append(CE)
                        break

        confirmation_text = "Here are all the Course Electives in "+ CC +", with "+Task_A+" assignments in them: \n"

        # Return both the confirmation text response and the list of course electives with the specified assignment
        return {'heading_message': confirmation_text, 'subjects_list': json.dumps(CE_with_A)}

    if intent == 'ListMajors':
        # Majors = list type
        majors = courseDetails.get('Majors', {}).get('L', [])
        M_list = []

        for M in majors:
            M = M.get('M', {})

            M_list.append(M)

        confirmation_text = "Here are all the Majors available in {} \n".format(CC)
        reformatted_response = {'heading_message': confirmation_text, 'subjects_list':  json.dumps(M_list)}

        return reformatted_response

    if intent == 'ListMinors':
        # Majors = list type
        minors = courseDetails.get('Minors', {}).get('L', [])
        M_list = []

        for M in minors:
            M = M.get('M', {})

            M_list.append(M)

        confirmation_text = "Here are all the Minors available in {} \n".format(CC)
        reformatted_response = {'heading_message': confirmation_text, 'subjects_list':  json.dumps(M_list)}

        return reformatted_response


    else:
        RR = "Your intent: " + intent + " has been fulfilled by the else block \n"
        return RR


# gets the course entry from DynamoDB based on coursecode in slots
def getCourseFromDB(event):
    print("trying to get from DB")
    slots = event['sessionState']['intent']['slots']
    intent = event['sessionState']['intent']['name']

    CC = slots['CourseCode']['value']['originalValue'].upper() #BP094P21
    dynamodb = boto3.client('dynamodb')
    table_name = 'Halbot_rahma'

    # Define the key condition expression for the query
    key_condition_expression = 'CourseCode = :cc'

    # Define the expression attribute values for the key condition expression
    expression_attribute_values = {
        ':cc': {'S': CC}  # Assuming coursecode is of string type
    }

    try:
        # Query DynamoDB table
        response = dynamodb.query(
            TableName=table_name,
            KeyConditionExpression=key_condition_expression,
            ExpressionAttributeValues=expression_attribute_values
        )

        print("DB gave response")

        # Check if any items are returned
        if 'Items' in response and len(response['Items']) > 0:
            return {
                'statusCode': 200,
                'body': response['Items'][0]
            }
        else:
            print("nothing found")
            return {
                'statusCode': 404,
                'body': 'No matching item found'
            }
    except Exception as e:
        print("ERROR : EXPCEPTION REACHED")
        return {
            'statusCode': 500,
            'body': str(e)
        }


def validateCourseCode(slots, intent):
    valid_courseCodes = ['BP094P21','BP094P23']
    non_mm_coursecodes = ['BP094P21']

    response_card_buttons = [
        {
            "text": "BP094P21 - Bachelor of Computer Science",
            "value": "BP094P21"
        },
        {
            "text": "BP094P23 - Bachelor of Computer Science",
            "value": "BP094P23"
        }
    ]

    MM_only_intents = ['ListMajors', 'ListMinors', 'ListMajorsAndMinors']

    if intent in MM_only_intents:
        valid_courseCodes = ['BP094P23']

        response_card_buttons = [
            {
                "text": "BP094P23 - Bachelor of Computer Science",
                "value": "BP094P23"
            }
        ]


    # validate against empty course codes (aka initial/so far utterance did not specify course code)
    if not slots['CourseCode']:
        print("Empty Course Code")

        return {
            'isValid': False,
            'violatedSlot': 'CourseCode',
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": "What is your course code?"
                },
                {
                    "contentType": "ImageResponseCard",
                    "content": "Here are the courses we currently offer: ",
                    "imageResponseCard": {
                        "title": "Here are the courses we currently offer:",
                        "buttons": response_card_buttons
                    }
                }

            ]
        }


    # now validate against any course codes that are not BP094P21
    if slots['CourseCode']['value']['originalValue'].upper() not in valid_courseCodes:
        CC = slots['CourseCode']['value']['originalValue'].upper()
        print("Course Code specified by user is not a Valid CourseCode")

        invalid_msg = "Sorry we do not offer that course."
        response_card_header = "Here are the courses we currently offer:"

        if intent in MM_only_intents and CC in non_mm_coursecodes:
            invalid_msg = "The course "+ CC+" does do not offer majors or minors."
            response_card_header = "Here are some courses that do:"


        return {
            'isValid': False,
            'violatedSlot': 'CourseCode',
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": invalid_msg
                },
                {
                    "contentType": "ImageResponseCard",
                    "content": response_card_header,
                    "imageResponseCard": {
                        "title": response_card_header,
                        "buttons": response_card_buttons
                    }
                }
            ]
        }

    return {'isValid': True}


def validateSemYear(slots):

    valid_SemYears = ['1','one','first','1st','second','2','2nd','3','3rd','third']

    response_card_buttons = [
        {
            "text": "Year 1",
            "value": "1"
        },
        {
            "text":"Year 2",
            "value": "2"
        },
        {
            "text":"Year 3",
            "value": "3"
        }
    ]

    # validate against empty course codes (aka initial/so far utterance did not specify course code)
    if not slots['SemYear']:
        print("Empty Semester year")

        return {
            'isValid': False,
            'violatedSlot': 'SemYear',
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": "Which year would you like to know ?"
                },
                {
                    "contentType": "ImageResponseCard",
                    "content": "Select from the Years given below ",
                    "imageResponseCard": {
                        "title": "Select from the Years given below:",
                        "buttons": response_card_buttons
                    }
                }

            ]
        }


    # now validate against any course codes that are not BP094P21
    if slots['SemYear']['value']['originalValue'].upper() not in valid_SemYears:
        print("Semester year specified by user is not a Valid semester year")
        return {
            'isValid': False,
            'violatedSlot': 'SemYear',
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": "The course is only 3 years long"
                },
                {
                    "contentType": "ImageResponseCard",
                    "content": "Select from the Years given below ",
                    "imageResponseCard": {
                        "title": "Select from the Years given below:",
                        "buttons": response_card_buttons
                    }
                }
            ]
        }
    return {'isValid': True}




def validateSemSem(slots):

    valid_SemSem = ['1','one', 'two', 'first','1st','second','2','2nd']

    response_card_buttons = [
        {
            "text": "Semester 1",
            "value": "1"
        },
        {
            "text":"Semester 2",
            "value": "2"
        }
    ]

    # validate against empty course codes (aka initial/so far utterance did not specify course code)
    if not slots['SemSem']:
        print("Empty Semester selceted")

        return {
            'isValid': False,
            'violatedSlot': 'SemSem',
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": "Which semester would you like to know ?"
                },
                {
                    "contentType": "ImageResponseCard",
                    "content": "Select from the Semesters given below ",
                    "imageResponseCard": {
                        "title": "Select from the Semesters given below:",
                        "buttons": response_card_buttons
                    }
                }

            ]
        }


    # now validate against any course codes that are not BP094P21
    if slots['SemSem']['value']['originalValue'].upper() not in valid_SemSem:
        print("Semester specified by user is not a Valid semester year")
        return {
            'isValid': False,
            'violatedSlot': 'SemSem',
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": "The course has only 2 semester per year"
                },
                {
                    "contentType": "ImageResponseCard",
                    "content": "Select from the Semesters given below ",
                    "imageResponseCard": {
                        "title": "Select from the Semesters given below:",
                        "buttons": response_card_buttons
                    }
                }
            ]
        }
    return {'isValid': True}

def validateSemNo(slots):

    valid_SemNo = ['1','2']

    response_card_buttons = [
        {
            "text": "Semester 1",
            "value": '1'
        },
        {
            "text":"Semester 2",
            "value": '2'
        }
    ]

    # validate against empty course codes (aka initial/so far utterance did not specify course code)
    if not slots['SemNo']:
        print("Empty Semester selceted")

        return {
            'isValid': False,
            'violatedSlot': 'SemNo',
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": "Which semester would you like to know ?"
                },
                {
                    "contentType": "ImageResponseCard",
                    "content": "Select from the Semesters given below ",
                    "imageResponseCard": {
                        "title": "Select from the Semesters given below:",
                        "buttons": response_card_buttons
                    }
                }

            ]
        }


    # now validate against any course codes that are not BP094P21
    if slots['SemNo']['value']['originalValue'] not in valid_SemNo:
        print("Semester specified by user is not a Valid semester year")
        return {
            'isValid': False,
            'violatedSlot': 'SemNo',
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": "Invalid Semester, Only the following semesters are being run:"
                },
                {
                    "contentType": "ImageResponseCard",
                    "content": "Select from the Semesters given below ",
                    "imageResponseCard": {
                        "title": "Select from the Semesters given below:",
                        "buttons": response_card_buttons
                    }
                }
            ]
        }

    return {'isValid': True}


def validate(slots, intent):

    if 'CourseCode' in slots:
        validation_result = validateCourseCode(slots, intent)
        if not validation_result['isValid']:
            return validation_result

    if 'SemYear'in slots:
        validation_result = validateSemYear(slots)
        if not validation_result['isValid']:
             return validation_result

    if 'SemSem'in slots:
        validation_result = validateSemSem(slots)
        if not validation_result['isValid']:
             return validation_result
    if 'SemNo' in slots:
        validation_result = validateSemNo(slots)
        if not validation_result['isValid']:
             return validation_result

    return {'isValid': True}




def welcome_intent_handler(event, intent, slots):

    response_message = "Here are some prompts you can try:"

    # text is what shows up on the button
    # value is what actually gets typed "by user" once button is pressed
    response_card_buttons = [
        {
            "text": "What are my course electives?",
            "value": "What are my course electives?"
        },
        {
            "text": "What are my classes this semester?",
            "value": "What are my classes this semester?"
        },
        {
            "text": "What are my subjects for this year ?",
            "value": "What are my subjects for this year ?"
        }
    ]

    if event['invocationSource'] == 'DialogCodeHook':
        response = {
            "sessionState": {
                "dialogAction": {
                    "type": "Close"
                },
                "intent": {
                    'name':intent,
                    'slots': slots,
                    'state':'Fulfilled'
                }
            },
            "messages": [
                {
                    "contentType": "ImageResponseCard",
                    "content": response_message,
                    "imageResponseCard": {
                        "title": "Here are some suggestion prompts you can try:",
                        "buttons": response_card_buttons
                    }
                }
            ]
        }

    return response

def fallback_intent_handler(event, intent, slots):
    response_message = "Sorry, the query you have typed is beyond my programmed knowledge base. Check the 'i' on the left for a list of queries you can try"

    # text is what shows up on the button
    # value is what actually gets typed "by user" once button is pressed
    response_card_buttons = [
        {
            "text": "What are my course electives?",
            "value": "What are my course electives?"
        },
        {
            "text": "What are my classes this semester?",
            "value": "What are my classes this semester?"
        },
        {
            "text": "What are my subjects for this year ?",
            "value": "What are my subjects for this year ?"
        }
    ]

    if event['invocationSource'] == 'DialogCodeHook':
        response = {
            "sessionState": {
                "dialogAction": {
                    "type": "Close"
                },
                "intent": {
                    'name':intent,
                    'slots': slots,
                    'state':'Fulfilled'
                }
            },
            "messages": [
                 {
                    "contentType": "PlainText",
                    "content": response_message
                },
                {
                    "contentType": "ImageResponseCard",
                    "content": response_message,
                    "imageResponseCard": {
                        "title": "Or here are some alternative queries you can try:",
                        "buttons": response_card_buttons
                    }
                }
            ]
        }

    return response

def lambda_handler(event, context):
    print("The new state? ", event['sessionState']['intent']['state'])
    slots = event['sessionState']['intent']['slots']
    intent = event['sessionState']['intent']['name']

    # Retrieve session attributes
    session_attributes = event.get('sessionState', {}).get('sessionAttributes', {})

    # some prints for clarification
    print("The event is: ", event['invocationSource'])
    print("The intent is: ", intent)
    print("here are the slots: ",slots)
    print("here are the session Attributes:, ", session_attributes)

    # Update slots with course code (if already in session and needed by slots and the slots hasnt already specified a course code)
    if 'CourseCode' in session_attributes and 'CourseCode' in slots and slots['CourseCode'] is None:
        print("slots being updated..")
        slots['CourseCode'] = json.loads(session_attributes['CourseCode'])

    print("here are the slots after update: ",slots)

    # Check if it's a new session
    is_new_session = event.get('sessionState', {}).get('newSession', False)

    if is_new_session:
        # If it's a new session, prompt the user for the course code
        response = {
            "sessionState": {
                "dialogAction": {
                    "type": "ElicitSlot",
                    "slotToElicit": "CourseCode"
                },
                "intent": {
                    'name': intent,
                    'slots': slots
                },
                "sessionAttributes": session_attributes
            }
        }
        return response


    if intent == 'WelcomeMessage':
        response = welcome_intent_handler(event, intent, slots)
        return response

    if intent == 'FallbackIntent':
        response = fallback_intent_handler(event, intent, slots)
        return response

    validation_result = validate(slots, intent)

    # if we are still receiving input from user,
    if event['invocationSource'] == 'DialogCodeHook':
        # then, validate that input continously till valid input is entered
        if not validation_result['isValid']:
            if 'messages' in validation_result:
                response_messages = validation_result['messages']
                response = {
                    "sessionState": {
                        "dialogAction": {
                            'slotToElicit': validation_result['violatedSlot'],
                            "type": "ElicitSlot"
                        },
                        "intent": {
                            'name': intent,
                            'slots' : slots
                        },
                        "sessionAttributes": session_attributes
                    },
                    "messages": response_messages
                }
            else:
                response = {
                    "sessionState": {
                        "dialogAction": {
                            'slotToElicit':validation_result['violatedSlot'],
                            "type": "ElicitSlot"
                        },
                        "intent": {
                            'name':intent,
                            'slots': slots
                        },
                        "sessionAttributes": session_attributes
                    }
                }

        # or (if already valid) just delegate it to lex (which should just bump it to fulfilment)
        else:
            print("reached valid, delegation")
            print("here are the slots: ",slots)
            print("here are the session Attributes:, ", session_attributes)
            # Initial Upload/(Update) session attributes with course code
            # session attributes HAS to be STRING
            session_attributes['CourseCode'] = json.dumps(slots['CourseCode'])

            response = {
            "sessionState": {
                "dialogAction": {
                    "type": "Delegate"
                },
                "intent": {
                    'name':intent,
                    'slots': slots
                },
                "sessionAttributes": session_attributes
            }
        }

    # if event is has reached fullfillment staged
    if event['invocationSource'] == 'FulfillmentCodeHook':
        print("Event has reached fulfilment code hook")

        # default response
        fullfilled_message_content = "DEFAULT: Thanks, I have fufilled your query using LAMBDA"

        # retrieve item from db based on courseCode
        if 'CourseCode' in slots:
            db_response = getCourseFromDB(event)
            courseDetails = db_response['body']
            print("db_response['body']: ",courseDetails)
            fullfilled_message_content = processCourseDetails(event, courseDetails)
            print(fullfilled_message_content)


        # spit out a fullfilled response
        if 'subjects_list' in fullfilled_message_content and 'heading_message' in fullfilled_message_content:
            print("reached here 2 fulfills")
            response = {
                "sessionState": {
                    "dialogAction": {
                        "type": "Close"
                    },
                    "intent": {
                        'name':intent,
                        'slots': slots,
                        'state':'Fulfilled'
                    },
                    "sessionAttributes": session_attributes
                },
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": fullfilled_message_content['heading_message']
                    },
                    {
                        "contentType": "CustomPayload",
                        "content": fullfilled_message_content['subjects_list']
                    }
                ]
            }
        else:
            print("inter:")
            response = {
                "sessionState": {
                    "dialogAction": {
                        "type": "Close"
                    },
                    "intent": {
                        'name':intent,
                        'slots': slots,
                        'state':'Fulfilled'
                    },
                    "sessionAttributes": session_attributes
                },
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": fullfilled_message_content
                    }
                ]
            }

    print("The new state? ", event['sessionState']['intent']['state'])
    return response