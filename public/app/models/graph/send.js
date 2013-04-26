// Generated by CoffeeScript 1.6.2
(function() {
  define(["app/config", "ural/modules/pubSub"], function(config, pubSub) {
    var Send;

    Send = (function() {
      function Send() {}

      Send._done = function(data, st) {
        if (data.errors || st !== "success") {
          return pubSub.pub("msg", "display", {
            type: "error",
            msg: "Submitted with errors"
          });
        } else {
          return pubSub.pub("msg", "display", {
            type: "success",
            msg: "Submitted with success"
          });
        }
      };

      Send.prototype.render = function() {
        $("#upload_data_button").click(function(e) {
          var txt;

          e.preventDefault();
          txt = $("#upload_data_text").val();
          return $.ajax({
            url: config.links.data_upload,
            data: txt,
            type: "post"
          }).always(Send._done);
        });
        return $("#upload_gexf_button").click(function(e) {
          var data;

          e.preventDefault();
          data = new FormData($("#upload_gexf_form")[0]);
          return $.ajax({
            url: config.links.gexf_upload,
            data: data,
            type: "post",
            cache: false,
            contentType: false,
            processData: false,
            enctype: "multipart/form-data"
          }).always(Send._done);
        });
      };

      return Send;

    })();
    return {
      Send: Send
    };
  });

}).call(this);
