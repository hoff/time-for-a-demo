import webapp2, json, jinja2, os, urllib, time, re, logging, uuid
from google.appengine.ext import ndb, blobstore
from google.appengine.api import memcache, mail, images, app_identity
from google.appengine.ext.webapp import blobstore_handlers
from google.appengine.datastore.datastore_query import Cursor

"""
Environment
"""
app_id = app_identity.get_application_id()

if app_id == 'time-for-a-demo':
    DO_TIME = False
    ENV_NAME = 'production'
    BACKEND_URL  = 'https://time-for-a-demo.appspot.com'
    FRONTEND_URL = 'https://time-for-a-demo.appspot.com'
    ALLOW_ORIGIN = '*'
else:
    DO_TIME = True
    ENV_NAME = 'develop'
    BACKEND_URL = 'http://localhost:8080'
    FRONTEND_URL = 'http://localhost:4200'
    ALLOW_ORIGIN = '*'


""" MATERIAL MODEL """
class MaterialModel(ndb.Model):
    """
    The model representing a material
    """
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
    article_id = ndb.StringProperty()
    numerical_id = ndb.IntegerProperty()
    name = ndb.StringProperty()
    description = ndb.StringProperty()
    tags = ndb.StringProperty(repeated=True)
    state = ndb.StringProperty()
    customer = ndb.StringProperty()
    comments = ndb.TextProperty()
    imageURL = ndb.StringProperty()

def material_to_object(material):
    return {
        'id': material.key.id(),
        'name': material.name,
        'description': material.description,
        'imageURL': material.imageURL,
        'articleID': material.article_id,
        'state': material.state,
        'customer': material.customer,
        'tags': material.tags,
        'created': material.created.strftime('%Y-%m-%d'),
        'updated': material.updated.strftime('%Y-%m-%d')
    }

class MaterialEndpoint(webapp2.RequestHandler):
    def get(self):
        allow_cors(self)
        id = int(self.request.get('id'))
        material = MaterialModel.get_by_id(id)
        return return_json(self, material_to_object(material))



""" MATERIAL ENDPOINT """
class MaterialsEndpoint(webapp2.RequestHandler):
    """
    The endpoint for materials
    """
    materials_per_page = 12

    def get(self):
        allow_cors(self)
        cursor_param = self.request.get('cursor')
        cursor = Cursor(urlsafe=cursor_param)
        filter = self.request.get('filter')
        if filter != 'All':
            materials, next_cursor, more = MaterialModel \
                .query(MaterialModel.state == filter)     \
                .fetch_page(self.materials_per_page, start_cursor=cursor)
            materialList = map(material_to_object, materials)
        else:
            materials, next_cursor, more = MaterialModel \
                .query()     \
                .fetch_page(self.materials_per_page, start_cursor=cursor)
            materialList = map(material_to_object, materials)

        response = {
			'data': materialList,
			'more': more,
			'next_cursor': next_cursor.urlsafe() if more else ''
		}
        return_json(self, response)


    def post(self):
        allow_cors(self)
        data = json.loads(self.request.body)
        id = data.get('id')
        material = MaterialModel.get_by_id(id)
        material.name = data.get('name')
        material.description = data.get('description')
        material.imageURL = data.get('imageURL')
        material.state = data.get('state')
        material.article_id = data.get('articleID')
        material.customer = data.get('customer')
        material.tags = data.get('tags')
        material.put()
        return_json(self, material_to_object(material))


    def put(self):
        allow_cors(self)
        data = json.loads(self.request.body)
        material_key = MaterialModel(
            name = data.get('name'),
            description = data.get('description'),
            imageURL = data.get('imageURL'),
            state = data.get('state'),
            article_id = data.get('articleID'),
            customer = data.get('customer'),
            tags = data.get('tags')
        ).put()
        material = material_key.get()
        return_json(self, material_to_object(material))

    def options(self):
        self.response.headers['Access-Control-Allow-Credentials'] = 'true'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
        self.response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE'
    

""" IMAGE  MODEL """
class ImageModel(ndb.Model):
    """
    The NDB model for user-uploaded images
    The id is set by us, and is a uuid plus the file name
    """
    created = ndb.DateTimeProperty(auto_now_add=True)
    updated = ndb.DateTimeProperty(auto_now=True)
    blob_key = ndb.BlobKeyProperty()
    width = ndb.IntegerProperty()
    height = ndb.IntegerProperty()

    @property
    def url(self):
        return BACKEND_URL + '/api/image/serve?key=' + str(self.blob_key)

    @property
    def id(self):
        return self.key.id()


"""
Image Endpoint
"""
class ImagesEndpoint(webapp2.RequestHandler):
    """
    returns all the images :)
    """
    def get(self):
        allow_cors(self)
        images = ImageModel.query().fetch()
        imageList = map(self.to_obj, images)
        return_json(self, imageList)

    def to_obj(self, image):
        return {
            'url': image.url
        }

""" IMAGE UPLOAD """

class UploadUrl(webapp2.RequestHandler):
    """
    Handler for requesting an upload url (which then redirects to IMAGE_UPLOAD_URL)
    """
    def get(self):
        allow_cors(self)
        upload_url = blobstore.create_upload_url(IMAGE_UPLOAD_URL)
        return_json(self, {'url': upload_url })


class ImageUploadHandler(blobstore_handlers.BlobstoreUploadHandler):
    """
    upload image endpoint (only works with post)
    """
    def post(self):
        allow_cors(self)
        try:
            upload = self.get_uploads()[0]
            data = blobstore.fetch_data(upload.key(), 0, 50000)
            measure_img = images.Image(image_data=data)
            id = uuid.uuid4().hex + upload.filename
            user_image_key = ImageModel(
                id=id,
                blob_key=upload.key(),
                width = measure_img.width,
                height = measure_img.height
            ).put()
            user_image = user_image_key.get()
            image_info = {'url': user_image.url, 'id': user_image.id }
            return_json(self, image_info)

        except Exception, e:
            logging.error(str(e))
            self.error(500)

    def options(self):
        allow_cors(self)



class ServeImage(webapp2.RequestHandler):
    """
    Serves an image of a given key. Can be resized with w and h query parameters,
    and the imag quality can also be set with the q parameter

    Defaults to width 500 with 80% quality
    """
    def get(self):
        # read params
        blob_key = self.request.get("key")
        resize_w = self.request.get("w")
        resize_h = self.request.get("h")
        quality = int(self.request.get("q", 90))
        crop_to_fit = True 
        # get image and resize
        image = images.Image(blob_key=blob_key)
        if resize_w and resize_h:
            image.resize(width=int(resize_w), height=int(resize_h), crop_to_fit=crop_to_fit) 
        elif resize_w:
            image.resize(width=int(resize_w))
        elif resize_h:
            image.resize(height=int(resize_h))
        else:
            image.resize(width=500)
        # generate and serve
        result = image.execute_transforms(output_encoding=images.JPEG, quality=quality)
        self.response.headers['Content-Type'] = 'image/jpeg'
        self.response.headers['Cache-Control'] = 'public, max-age=31536000'
        return self.response.out.write(result)

def allow_cors(request):
    """
    set the appropriate response headers for cross-origin requests
    """
    request.response.headers['Access-Control-Allow-Credentials'] = 'true'
    request.response.headers['Access-Control-Allow-Origin'] = '*'
    request.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
    request.response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE'

def return_json(handler, data):
    """
    returns JSON from an object to a given request handler
    """
    handler.response.headers['Content-Type'] = 'application/json; charset=utf-8'
    handler.response.out.write(json.dumps(data))



IMAGE_UPLOAD_URL = '/api/image/upload'

app = webapp2.WSGIApplication(
    [
        # material endpoints
        ('/api/materials', MaterialsEndpoint),
        ('/api/material', MaterialEndpoint),

        # image endpoint
        ('/api/images', ImagesEndpoint),

        # generate an upload-url
        ('/api/image/upload-url', UploadUrl),

        # upload image (the generated url redirects here)
        ('/api/image/upload', ImageUploadHandler),

        # image serving
        ('/api/image/serve', ServeImage),

    ],
    debug=True
)
