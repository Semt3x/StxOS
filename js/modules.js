var currentApp = {};
// reset all modules on page load
function reloadModules()
{    
    $('body').css('background-color', '#fff');    
}

var routes = {};
function route (path, templateId) {
    routes[path] = {templateId: templateId};
}
var el = null;
function router () {
    // Lazy load view element:
    el = el || document.getElementById('mainView');

    $("#mainView").css("opacity",0);
    setTimeout(function() {

        // Current route url (getting rid of '#' in hash as well):
        var url = location.hash.slice(1) || '/';
        // Get route by url:
        var route = routes[url];
        // Do we have both a view and a route?
        if (el && route.templateId) {
            // Render route template with John Resig's template engine:
            $("#mainView").load("/partials/"+route.templateId+".html");
            setTimeout(function() {
                $("#mainView").css("opacity",1);
            },300);
        }
    }, 500);
}
// Listen on hash change:
window.addEventListener('hashchange', router);
// Listen on page load:
window.addEventListener('load', router);

function bashMode()
{
    commandList = ['back', 'setapp', 'applist', 'help', 'echo', 'bye'];
    $('body').css('background-color', '#323340');
    jQuery(function($, undefined) {
    $('#bashArea').terminal(function(command, term) {
        if (command == 'back') {
            term.echo('not implemented yet')
        }else if (command.indexOf('setapp') > -1 || (command.indexOf('go') > -1)) {
            console.log(command.split(' ').length);
            if(command.split(' ').length == 2)
            {
                $.ajax({
                    url: '/cgi-bin/getApplicationsList.py',
                    success: function(data){
                        app = command.split(' ')[1];
                        if(data.applications.indexOf(app+'.html') > -1)
                        {
                            term.echo('loading application '+ app)
                            window.location = "/#/"+app;  
                        }
                        else{
                            term.echo('unknown application '+app);
                        }
                    }
                });
            } else {
                term.echo('setapp usage : setapp <appname>, applications names can be obtained via "applist" command')
            }
            
        }else if (command.indexOf('applist') > -1) {
            term.echo('Getting applications list...');
            $.ajax({
                url: '/cgi-bin/getApplicationsList.py',
                success: function(data){
                    console.log(data.applications)
                    for(a in data.applications)
                    {
                        term.echo(data.applications[a].replace('.html', ''));
                    }
                }
            });

        }else if (command.indexOf('echo') > -1) {
            term.echo(command.replace('echo ', ''));

        }else if (command.indexOf('bye') > -1) {
            term.echo('Bye !');
            setTimeout(function(){
                window.location = "/#/Home";
            },1000);

        }else if (command.indexOf('help') > -1) {
            term.echo('Here is a list of enable commands...')
            for(a in commandList)
            {
                term.echo(commandList[a]);
            }

        } else {
            term.echo('unknown command');
        }
    }, {
        greetings: "This is a simple jquery prompt\nTry some js stuff here\nCould've done my own but I've been lazy...\n\nType 'help' for a list of available commands",
        name: 'haiJS',
        height: 350,
        prompt: 'js> '});
    });
}

route('/', 'Home');
route('/Home', 'Home');
route('/Monitoring', 'Monitoring');
route('/Bash', 'Bash');
route('/Chat', 'Chat');
route('/Reminder', 'Reminder');
route('/CheatSheets', 'CheatSheets');
