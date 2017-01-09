from django.shortcuts import render

def index(request):
    return render(request, 'game/index.html')

def enter(request):
    if request.is_ajax():
        m = Entry(player_name='cocalar', table_width=10, table_height=10)
        m.save()
