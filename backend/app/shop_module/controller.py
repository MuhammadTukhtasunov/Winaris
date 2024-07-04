from app.models.student_evaluations import (
    Evaluations as Eval, 
    EvaluationDetails as EvalDetails, 
    EvaluationQuestions as EvalQuestions,
    EvaluationDetailsTmp,
    EvaluationsTmp
)
from app.models.student_evaluations import EvaluationDetails
from app.models.user import User
from app.models.parts import Parts
from app.models.parts_tmp import PartsTmp
from flask_login import current_user
from http import HTTPStatus
from datetime import datetime
from app.extensions import db
from flask import jsonify, current_app
from werkzeug.utils import secure_filename
import pandas as pd
import numpy as np
from io import BytesIO
from collections import defaultdict

# Winaris Shop Module

# Get parts controller
def get_parts_controller():

    # Get parts from database
    parts = Parts.query.all()

    # Console log the error
    for part in parts:
        print(f"Part Number: {part.part_number}")
        print(f"Price: {part.price}")
        print(f"Quantity: {part.quantity}")
        print(f"Vehicle: {part.vehicle}")
        print(f"Date Added: {part.date_added}")
        print("--------------------")

    if not parts:
        print("No parts found.")
        return {'error': 'No parts found.'}, HTTPStatus.NOT_FOUND
    
    return [{
        'part_number': part.part_number,
        'price': part.price,
        'quantity': part.quantity,
        'vehicle': part.vehicle,
        'date_added': part.date_added
    } for part in parts], HTTPStatus.OK

# Upload parts controller
def upload_parts_controller(request):
    try:
        # Make sure current user is an admin
        if current_user.position != 'chair':
            return dict(error='You do not have authority to upload parts.'), HTTPStatus.UNAUTHORIZED
        
        # Check if the request contains a file
        if 'file' not in request.files:
            return dict(error='No file part'), HTTPStatus.BAD_REQUEST
        
        file = request.files['file']

        # Check if file is present and has an allowed extension (if needed)
        if file.filename == '':
            return dict(error='No selected file'), HTTPStatus.BAD_REQUEST
        
        fn = file.filename
        if ('.' not in fn or fn.split('.')[-1].lower() not in 
            current_app.config['ALLOWED_EVAL_EXTENSIONS']):

            return dict(error='File extension not allowed'), HTTPStatus.BAD_REQUEST

        # Parse the file
        fbytes = BytesIO(file.read())
        parts, skipped_rows, existing_rows = parse_and_upload_excel(fbytes)

        # Clear old rows from tmp tables 
        db.session.query(PartsTmp).delete()

        # Add existing rows to the temp table in database
        if skipped_rows:
            db.session.add_all(existing_rows)
        
        # Add parts to the database
        db.session.add_all(parts)
        db.session.commit()

        if skipped_rows:
            return dict(mssg='Parts uploaded successfully - skipped rows', skipped_rows=skipped_rows), HTTPStatus.OK
        return dict(mssg='Parts uploaded successfully'), HTTPStatus.OK
        
    except Exception as e:
        print(e)
        if e == 'Error reading excel file':
            return dict(error='Escel file incorrectly formatted'), HTTPStatus.BAD_REQUEST
        return dict(error="Error uploading file. Please try again."), HTTPStatus.INTERNAL_SERVER_ERROR

# Parse and upload excel file function
def parse_and_upload_excel(fbytes):
    try:
        df = pd.read_excel(fbytes)
    except Exception:
        raise Exception('Error reading excel file')
    
    df.columns = [c.lower() for c in df.columns]

    parts = []
    skipped_entries = []
    existing_rows = []
    seen_sections = set()

    # loop through rows in excel sheet
    for i in range(len(df)):
        row = df.iloc[i].to_dict()

        # Get first few fields
        keyerror = False
        try:
            part_number = str(row['part number'])
            vehicle = str(row['vehicle'])
            price = int(row['price'])
            quantity = int(row['quantity'])
        except KeyError:
            keyerror = True
        
        part = Parts(part_number=part_number,
                     vehicle=vehicle,
                     price=price,
                     quantity=quantity)
        
        parts.append(part)
    return parts, skipped_entries, existing_rows
        



