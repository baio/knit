define ->

  class DataProvider

    onGetBaseUrl: -> "http://localhost:8080"

    onFlatData: (data) ->
      for own prop of data
        if !(data[prop] instanceof Date) and (typeof data[prop] == "object" or Array.isArray data[prop])
          delete data[prop]
      @date2json data
      data

    parseDate: (str) ->
      dt = moment(str, "YYYY-MM-DDTHH:mm:ss.Z")
      if dt.isValid()
        dt.toDate()
      else
        undefined

    formatDate: (obj) ->
      obj.toUTCString()

    date2json: (data) ->
      #though in this instance object is flat in derived it could be not, so recursive
      for own prop of data
        if data[prop] instanceof Date
          data[prop] = formatDate(data[prop])
        else if typeof data[prop] == "object"
          @date2json data[prop]
        else if Array.isArray data[prop]
          @date2json d for d in data[prop]

    json2date: (data) ->
      #though in this instance object is flat in derived it could be not, so recursive
      for own prop of data
        if typeof data[prop] == "string"
          dt = @parseDate data[prop]
          data[prop] = dt if dt
        else if Array.isArray data[prop]
          for d in data[prop]
            @json2date d
        else if typeof data[prop] == "object"
          @json2date data[prop]

    onGetUrl: (resource, action) ->
      if action
        res = "/#{resource}/#{action}"
      else
        res = "/#{resource}"

      @onGetBaseUrl() + res

    onGetError: (resp, res) ->
      if res == "error"
        code : resp.status, message : resp.statusText
      else if resp.errors or resp.error
        code : 500, message : (if resp.error then resp.error else "Error"), errors : resp.errors

    get: (resource, filter, done) ->
      $.get(@onGetUrl(resource), filter)
        .always (resp, res) =>
          err = @onGetError(resp, res)
          if !err
            @json2date resp
          done err, resp

    update: (resource, data, done) ->
      @date2json(data)
      $.put(@onGetUrl(resource), JSON.stringify(data))
        .always (resp, res) =>
          err = @onGetError(resp, res)
          if !err
            @json2date resp
          done err, resp

    create: (resource, data, done) ->
      @date2json(data)
      $.post(@onGetUrl(resource), JSON.stringify(data))
        .always (resp, res) =>
          err = @onGetError(resp, res)
          if !err
            @json2date resp
          done err, resp

    ajax: (resource, method, data, done) ->
      @date2json(data)
      $.ajax(
        url: @onGetUrl(resource)
        data: JSON.stringify(data)
        method : method
        crossDomain : true
      ).always (resp, res) =>
          err = @onGetError(resp, res)
          if !err
            @json2date resp
          done err, resp


  new DataProvider()