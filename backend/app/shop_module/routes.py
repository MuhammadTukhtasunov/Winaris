from flask_login import login_required
from flask import request
from app.shop_module import blueprint
from app.shop_module.controller import (
    get_parts_controller,
    upload_parts_controller
)

# Winaris Shop

# Get parts from the database
@blueprint.route('/winaris_shop', methods=['GET'])
@login_required
def get_winaris_shop():
    return get_parts_controller()

# Upload parts to database
@blueprint.route('/winaris_upload', methods=['POST'])
@login_required
def upload_parts():
    return upload_parts_controller(request)
