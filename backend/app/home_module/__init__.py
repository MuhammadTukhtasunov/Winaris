from flask import Blueprint

blueprint = Blueprint('home', __name__)

from app.home_module import routes
