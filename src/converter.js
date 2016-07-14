/**
 * Created by griga on 12/6/15.
 */

const cheerio = require('cheerio')
const _ = require('lodash');


module.exports.process = (raw) => {
    /* ng2 replacements */
    raw = raw.replace(/ng-if/g, '*ngIf')
    raw = raw.replace(/ng-show/g, '*ngIf')
    raw = raw.replace(/ng-hide="/g, '*ngIf="!')


    /* bootastrap */

    raw = raw


        .replace(/(data-)?(data-smart-)?tooltip(-html)?="/g, 'tooltip="')
        .replace(/(data-)?tooltip-placement/g, 'tooltipPlacement')
        .replace(/(data-)?smart-html-popover="/g, 'data-toggle="popover" data-html="true" data-content="')
        .replace(/(data-)?popover-title="/g, 'title="')
        .replace(/(data-)?popover="/g, 'data-toggle="popover" data-content="')
        .replace(/(data-)?popover-placement/g, 'data-placement')
        .replace(/(data-)?popover-trigger=/g, 'data-trigger=')


    /* smartadmin */
    raw = raw.replace(/href-void(="")?/g, 'href=""')

    var $ = cheerio.load(raw, {

        decodeEntities: false
    });


    /* ng2 */

    /* smartadmin */

    //widget grid
    $('#widget-grid').each(function () {
        $(this).replaceWith('<sa-widgets-grid>' + $(this).html() + '</sa-widgets-grid>')
    })

    //jarvis widget

    $('[jarvis-widget], [data-jarvis-widget], .jarviswidget').each(function () {
        var old = $(this).clone()
        var widget = $('<sa-widget />')


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
        ], function (attr) {

            widget.attr(attr, old.attr(attr));
        });
        widget.append(old.html())
        $(this).replaceWith(widget)
    })


    var processed = $.html()


    processed = processed
        .replace(/"~~~\{/g, '{')
        .replace(/\}~~~"/g, '}')
        // .replace(/class="/g, 'className="')
        // .replace(/for="/g, 'htmlFor="')
        // .replace(/maxlength="/g, 'maxLength="')
        // .replace(/readonly="/g, 'readOnly="')
        // .replace(/colspan="/g, 'colSpan="')
        // .replace(/rowspan="/g, 'rowSpan="')
        // .replace(/tabindex="/g, 'tabIndex="')
        // .replace(/checked=(\"checked\")?/g, 'defaultChecked')


        .replace(/data-widget-colorbutton="false"/g, 'colorbutton="false"')
        .replace(/data-widget-editbutton="false"/g, 'editbutton="false"')
        .replace(/data-widget-togglebutton="false"/g, 'togglebutton="false"')
        .replace(/data-widget-deletebutton="false"/g, 'deletebutton="false"')
        .replace(/data-widget-fullscreenbutton="false"/g, 'fullscreenbutton="false"')
        .replace(/data-widget-custombutton="false"/g, 'custombutton="false"')
        .replace(/data-widget-sortable="false"/g, 'sortable="false"')
        .replace(/data-widget-color=/g, 'color=')

    // .replace(/div smart-include=\"app\/layout\/partials\/sub-header.tpl.html\"/g, 'SubHeader ')
    .replace(/big-breadcrumbs/g, 'sa-big-breadcrumbs')
    /*            .replace(/style="([^"]+)"/g, function (match, style) {
     style = style.split(/;/).map(function (rawProp) {
     var prop = rawProp.split(/:/)
     if (prop.length > 1)
     return _.camelCase(prop[0]) + ':' + "'" + prop[1].trim() + "'"
     else
     return ''
     }).join(',')
     return 'style={{' + style + '}}'
     })*/
    return processed
}


