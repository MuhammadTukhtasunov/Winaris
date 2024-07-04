from flask import Blueprint

blueprint = Blueprint('shop', __name__)

from app.shop_module import routes