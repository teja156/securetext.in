"""securetext_in URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from sitehandler import views as sitehandler_views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('',sitehandler_views.open_homepage,name="home_page"),
    path('about/',sitehandler_views.open_aboutpage,name="about_page"),
    path('how-it-works/',sitehandler_views.open_howitworkspage,name="how-it-works"),
    path('report/',sitehandler_views.open_reportpage,name="report_page"),
    path('load_layout/',sitehandler_views.load_layout),
    path('load_site/',sitehandler_views.load_site),
    path('save_site/',sitehandler_views.save_site),
    path('delete_site/',sitehandler_views.delete_site),
    path('<slug:site_url>/', sitehandler_views.open_site),
]
