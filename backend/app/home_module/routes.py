from flask_login import login_required
from app.home_module import blueprint
from app.home_module.controller import (
    home_controller
)
from flask import request

# Define all routes that are related to the home page

@blueprint.route('/home', methods=['GET'])
@login_required
def home():
    return home_controller()