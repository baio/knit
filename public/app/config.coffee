define ->

  _dev =
    base_url : "/srv" #"http://localhost:8080"#"/srv"
    links :
      panel_gexf_url : "http://localhost:8080/gexf"
      data_upload : "http://localhost:8080/contribs"
      gexf_download : "http://localhost:8080/gexf"
      gexf_upload : "http://localhost:8080/gexf"

  _prod =
    base_url : "/srv"
    links :
      panel_gexf_url : "http://baio-links.herokuapp.com/gexf"
      data_upload : "http://baio-links.herokuapp.com/contribs"
      gexf_download : "http://baio-links.herokuapp.com/gexf"
      gexf_upload : "http://baio-links.herokuapp.com/gexf"

  _prod
