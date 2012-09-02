from twisted.web.server import Site, NOT_DONE_YET
from twisted.web.resource import Resource
from twisted.internet import reactor
from twisted.web.static import File

from jinja2 import Environment, FileSystemLoader

import re
#---------------
# JINJA STUFF
#---------------
template_root = 'templates/'
jloader = FileSystemLoader(template_root, encoding='utf-8')
jenv = Environment(
    block_start_string='[[',
    block_end_string=']]',
    variable_start_string='[-',
    variable_end_string='-]',
    comment_start_string='[#',
    comment_end_string='#]',
    loader=jloader,
    extensions=[],
    cache_size=50,
)

def jrender(request, template_name, params=None):
    """
    Use Jinja to render a html file
    """
    if params is None:
        params = {}
    request.setHeader("content-type", "text/html")
    return jenv.get_template(template_name).render(params).encode('utf-8')


class MainResource(Resource):
    """
    Handles the root directory
    """
    def render_GET(self, request):
        return jrender(request, 'index.html')


class Jules1(Resource):
    """
    Example 1
    """
    def render_POST(self, request):
        return jrender(request, 'jules1.html')


#URL HANDLING
root = Resource()

css_resource = File('./static/css')
js_resource = File('./static/js')
img_resource = File('./static/img')

#STATIC STUFF
root.putChild('css', css_resource)
root.putChild('js', js_resource)
root.putChild('img', img_resource)

#ROOT
root.putChild('', MainResource())

root.putChild("jules1", Jules1())

factory = Site(root)
reactor.listenTCP(8989, factory)
reactor.run()

