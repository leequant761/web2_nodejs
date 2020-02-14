var template = {
    html: function(title, list, body, control){
        return `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          ${control}
          ${body}
        </body>
        </html>
        `;
    },
    list: function(file_list){
        var list = '<ul>'
        var i = 0;
        while(i < file_list.length){
            list = list + `<li><a href='/?id=${file_list[i]}'>${file_list[i]}</a></li>`
            i = i + 1;
        }
        list = list + '</ul>';
        return list;
    }
};

module.exports = template;