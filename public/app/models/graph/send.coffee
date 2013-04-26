define ["app/config", "ural/modules/pubSub"], (config, pubSub) ->

  class Send

    @_done: (data, st) ->
      if data.errors or st != "success"
        pubSub.pub "msg", "display", type : "error", msg : "Submitted with errors"
      else
        pubSub.pub "msg", "display", type : "success", msg : "Submitted with success"

    render: ->

      #$("#download_gexf_button")[0].href = config.links.gexf_download

      $("#upload_data_button").click (e) ->
        e.preventDefault()
        #upload data to server
        txt = $("#upload_data_text").val()
        $.ajax(
          url : config.links.data_upload
          data : txt
          type : "post"
        )
          .always(Send._done)

      $("#upload_gexf_button").click (e) ->
        e.preventDefault()
        data = new FormData($("#upload_gexf_form")[0])
        $.ajax(
          url : config.links.gexf_upload
          data : data
          type : "post"
          cache: false,
          contentType: false,
          processData: false,
          enctype: "multipart/form-data"
        )
          .always(Send._done)


  Send : Send