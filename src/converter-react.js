/**
 * Created by griga on 12/6/15.
 */

var cheerio = require('cheerio')
var _ = require('lodash')


var converter = {
    process: function(raw){
        raw = raw
            .replace(/<!--/g, '{/*')
            .replace(/-->/g, '*/}')
            .replace(/{{/g, '[[')
            .replace(/}}/g, ']]')
            .replace(/\{\/\* widget options:[\s\S]+?\*\/\}/g, '')
            .replace(/<input([^>]+?)>/g, '<input $1/>')
            .replace(/<input([^>]+?)\/\/>/g, '<input $1/>')
            .replace(/<img([^>]+?)>/g, '<img $1/>')
            .replace(/<img([^>]+?)\/\/>/g, '<img $1/>')
            .replace(/<br\s*>/g, '<br />')
            .replace(/<hr([^>]+?)>/g, '<hr $1/>')
            .replace(/<hr([^>]+?)\/\/>/g, '<hr $1/>')
            // .replace(/href-void(="")?/g, 'href=""')

            .replace(/(data-)?tooltip-html="/g, 'data-toggle="tooltip" data-html="true" title="')
            .replace(/(data-)?tooltip="/g, 'data-toggle="tooltip" title="')
            .replace(/(data-)?tooltip-placement/g, 'data-placement')

            .replace(/(data-)?smart-html-popover="/g, 'data-toggle="popover" data-html="true" data-content="')
            .replace(/(data-)?popover-title="/g, 'title="')
            .replace(/(data-)?popover="/g, 'data-toggle="popover" data-content="')
            .replace(/(data-)?popover-placement/g, 'data-placement')
            .replace(/(data-)?popover-trigger=/g, 'data-trigger=')

        var $ = cheerio.load(raw, {
            xmlMode: true,
            decodeEntities: false
        })


        //tooltip
        $('[data-toggle=tooltip]').each(function(){
            var $this = $(this);
            var $elem = $this.clone();

            var title = $elem.attr('title')

            var overlay = $('<OverlayTrigger />')
            overlay.attr('placement', $elem.data('placement'))

            var tooltip=$('<Tooltip>'+title+'</Tooltip>')
            tooltip.attr('id', _.kebabCase(title)+'-tooltip')

            overlay.attr('overlay', '~~~{' + $('<div />').append(tooltip).html() + '}~~~' )

            _.each(['data-placement', 'data-toggle', 'data-html', 'title'], function(attr){
                $elem.removeAttr(attr)
            })

            overlay.append($elem)
            $this.replaceWith(overlay)
        })

        //popover
        $('[data-toggle=popover]').each(function(){
            var $this = $(this);
            var $elem = $this.clone();

            var title = $elem.attr('title')
            var content = $elem.attr('data-content')

            var overlay = $('<OverlayTrigger />')
            overlay.attr('placement', $elem.data('placement'))

            var popover=$('<Popover>'+content+'</Popover>')
            popover.attr('id', _.kebabCase(title || _.uniqueId('popover') )+'-popover')

            if(!$elem.attr('data-trigger')){
                overlay.attr('trigger', 'click')
            }

            overlay.attr('overlay', '~~~{' + $('<div />').append(popover).html() + '}~~~' )


            _.each(['data-placement', 'data-trigger', 'data-toggle', 'data-content', 'data-html', 'title'], function(attr){
                $elem.removeAttr(attr)
            })

            overlay.append($elem)
            $this.replaceWith(overlay)
        })



        //widget grid
        $('#widget-grid').each(function(){
            $(this).replaceWith('<WidgetGrid>' + $(this).html() + '</WidgetGrid>')
        })

        //jarvis widget

        $('[jarvis-widget], [data-jarvis-widget], .jarviswidget').each(function(){
            var old = $(this).clone()
            var widget = $('<JarvisWidget />')


            _.each([
                'class',
                'data-widget-colorbutton',
                'data-widget-editbutton',
                'data-widget-togglebutton',
                'data-widget-deletebutton',
                'data-widget-fullscreenbutton',
                'data-widget-custombutton',
                'data-widget-collapsed',
                'data-widget-sortable',
                'data-widget-hidden',
                'data-widget-color',
                'data-widget-load',
                'data-widget-refresh'
            ], function(attr) {

                widget.attr(attr, old.attr(attr));
            });
            widget.append(old.html())
            $(this).replaceWith(widget)
        })




        var processed = $.html()



        processed = processed
            .replace(/"~~~\{/g, '{')
            .replace(/\}~~~"/g, '}')
            .replace(/class="/g, 'className="')
            .replace(/for="/g, 'htmlFor="')
            .replace(/maxlength="/g, 'maxLength="')
            .replace(/readonly="/g, 'readOnly="')
            .replace(/colspan="/g, 'colSpan="')
            .replace(/rowspan="/g, 'rowSpan="')
            .replace(/tabindex="/g, 'tabIndex="')
            .replace(/checked=(\"checked\")?/g, 'defaultChecked')


            .replace(/data-widget-colorbutton="false"/g, 'colorbutton={false}')
            .replace(/data-widget-editbutton="false"/g, 'editbutton={false}')
            .replace(/data-widget-togglebutton="false"/g, 'togglebutton={false}')
            .replace(/data-widget-deletebutton="false"/g, 'deletebutton={false}')
            .replace(/data-widget-fullscreenbutton="false"/g, 'fullscreenbutton={false}')
            .replace(/data-widget-custombutton="false"/g, 'custombutton={false}')
            .replace(/data-widget-sortable="false"/g, 'sortable={false}')
            .replace(/data-widget-color=/g, 'color=')

            .replace(/div smart-include=\"app\/layout\/partials\/sub-header.tpl.html\"/g, 'SubHeader ')
            .replace(/big-breadcrumbs/g, 'BigBreadcrumbs')
            .replace(/style="([^"]+)"/g, function(match, style){
                style = style.split(/;/).map(function(rawProp){
                    var prop = rawProp.split(/:/)
                    if(prop.length>1)
                        return _.camelCase(prop[0]) + ':' + "'" +prop[1].trim() +"'"
                    else
                        return ''
                }).join(',')
                return 'style={{' + style + '}}'
            })
        return processed
    }
};


module.exports = converter;