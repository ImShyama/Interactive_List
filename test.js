function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var master_sht = ss.getSheetByName("Master");
  var templates = ss.getSheetByName('Templates')
  var delegator = master_sht.getRange(3, 11, master_sht.getLastRow(), 10).getValues().filter(function (r) { return r[0] != '' })
  var boss = master_sht.getRange(3, 5, 29, 5).getValues().filter(function (r) { return r[0] != '' })
  var boss_report = master_sht.getRange(106, 1, 20, 3).getValues().filter(function (r) { return r[0] != '' })
  console.log("boss_report", boss_report);
  var tasksht = ss.getSheetByName('Customer DB')
  var customer_db = ss.getSheetByName('Customer DB');
  var inquiry_sht = ss.getSheetByName('Inquiries')
  var len = Object.keys(e.parameter);
  var useremail = Session.getActiveUser().getEmail();

  var favicon = 'https://i.ibb.co/K00ch0m/CEOITBOX-Logo-Small.png'

  var passwd = '';
  var page = e.parameter.page
  var role = e.parameter.role
  if (role != null) {
    role = role.toLowerCase()
  }
  var label = ''

  if (useremail == '') {
    useremail = e.parameter.user
    passwd = e.parameter.pswd
  }

  var pswdcol = 5;
  var photcol = 6
  if (role == "boss") {
    var deldt1 = boss.filter(function (r) {
      return r[1] == useremail
    })
    pswdcol = 3;
    photcol = 4;
    label = 'all'
  } else {
    var deldt1 = delegator.filter(function (r) {
      return r[2] == useremail
    })
  }
  if (deldt1.length > 0) {
    passwd = deldt1[0][pswdcol]
    if (page == null) {
      page = "customer_db"
    }
  }

  if (page == "Inquiries" || page == "dashboard" || page == 'New_Enquiry' || page == 'updatein' || page == 'updates' || page == "pipeline" || page == 'report') {
    tasksht = inquiry_sht;
  }
  //------------------------all settings data-----------------------------------
  var logolink = master_sht.getRange("B16").getValue()
  var logohref = master_sht.getRange("B17").getValue()

  var mindate = Utilities.formatDate(new Date(), "GMT+05:30", "yyyy-MM-dd")

  if (logolink.indexOf("https://drive.google.com") > -1) {
    var id = logolink.match(/[-\w]{25,}/)[0];
    logolink = 'http://drive.google.com/uc?export=view&id=' + id
  }

  var stepnm = tasksht.getRange("1:1").getValues()[0].filter(function (r) {
    return r !== ''
  })
  var totstep = stepnm.length
  /*
  var colsize = []
  var datatype = []
  var filters = []
  var drparr = []

  var color = []
  var seting_data = []
  for (var s = 1; s <= totstep; s++) 
  {
    seting_data.push([tasksht.getRange(1, s).getValue(), tasksht.getRange(2, s).getValue(), s - 1])
    color.push(tasksht.getRange(1, s).getBackground())
    var arr = tasksht.getRange(2, s).getValue().split(",")
    if (arr.length < 2) 
    {
      arr = ['text', 'null']
    }
    datatype.push(String(arr[0]).toLowerCase())
    if(arr[1] == '') 
    {
      filters.push("null")
    } 
    else 
    {
      filters.push(String(arr[1]).toLowerCase())
    }
    colsize.push(tasksht.getColumnWidth(s))
    if (arr[0].toLowerCase().indexOf('dropdown') > -1)
    {
      var itm = filteritm(arr[0].split(":")[1]);
      drparr.push(itm);
    } 
    else 
    {
      drparr.push([]);
    }

  }

  var freeze=0
  var freeze_col = seting_data.filter(function(r){
  return r[1].toUpperCase().indexOf('FREEZE')>-1
  });

  if(freeze_col.length>0){
  freeze=freeze_col[0][2]
  }
  var values0 = seting_data.filter(function (r) {
  return r[1].toUpperCase().indexOf('HIDDEN') > -1 && r[1].toUpperCase().indexOf('INPUT-HIDDEN') == -1
  });

  if (values0.length == 0) {
  values0 = [['', '', '']]
  }
  */

  try {
    var settingobj = JSON.parse(tasksht.getRange("B1").getNote())
  } catch (e) {
    updateform(tasksht.getName());
    var settingobj = JSON.parse(tasksht.getRange("B1").getNote())
  }

  var colsize = settingobj.colsize
  var datatype = settingobj.datatype
  var filters = settingobj.filters
  var drparr = settingobj.drparr
  var color = settingobj.color
  var values0 = settingobj.values0
  var freeze = settingobj.freeze;


  //login form  will open if email is out of domain
  if ((len.length == 0 && useremail == '') || page == null) {
    var docbody = gethtml('Login')
    var htmlTemplate = HtmlService.createTemplate(docbody)
    htmlTemplate.company = master_sht.getRange('B15').getValue()
    htmlTemplate.logolink = logolink

    if (role == null) {
      role = ''
    }

    htmlTemplate.data = {
      'delegator': delegator,
      'scripturl': master_sht.getRange('B21').getValue(),
      'boss': boss,
      'role': role,
      'customer': [],
      'pswdcol': pswdcol,
      'logolink': logolink
    }
    var html = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag('viewport', 'width=device-width, initial-scale=1');
    return html;
  }

  else if (page == 'customer_db' || page == "Inquiries" || page == "updates" || page == "dashboard" || page == "pipeline" || page == 'report') {
    console.log(new Date())
    var docbody = gethtml(page)
    var htmlTemplate = HtmlService.createTemplate(docbody)

    if (role == "boss") {
      var userdata = boss.filter(function (r) {
        return r[1] == useremail
      })
    } else {
      var userdata = delegator.filter(function (r) {
        return r[2] == useremail
      })
    }

    const calendata = []
    var wausers = []


    for (var r = 3; r <= delegator.length + 2; r++) {
      if (master_sht.getRange(r, 18).getBackground() == '#00ff00') {
        calendata.push(master_sht.getRange(r, 12).getValue())
      }
    }
    console.log("mid " + new Date())

    var c_code = e.parameter.vcod
    if (c_code == null) {
      c_code = ''
    }
    if (c_code) {
      var hidecol = []
      var editcol = []
      for (var s = 1; s < totstep; s++) {
        editcol.push(s)
      }
      var customerdata = tasksht.getDataRange().getDisplayValues().filter(function (r) {
        return r[0] == 'Customer Code' || r[0] == c_code
      })
      hidecol = hidecol.join(",")
      editcol = editcol.join(",")
    } else {
      if (page == "customer_db") {
        if (label == '') {
          label = userdata[0][9]
        }
        var customerdata = []
        var hidecol = master_sht.getRange("B33").getDisplayValue()
        var editcol = master_sht.getRange("B34").getDisplayValue()
      } else {
        if (label == '') {
          label = userdata[0][2]
        }

        if (page == "updates") {
          var customerdata = []
          var editcol = ''
        } else {
          var customerdata = []
          if (role != 'boss') {
            var editcol = master_sht.getRange("B43").getDisplayValue()
          } else {
            var editcol = master_sht.getRange("B41").getDisplayValue()
          }
        }
        if (role != 'boss') {
          var hidecol = master_sht.getRange("B42").getDisplayValue()
        } else {
          var hidecol = master_sht.getRange("B40").getDisplayValue()
        }
        var header = master_sht.getRange("2:2").getValues()[0]
        var stindex = header.indexOf('Sales Stage')
        var stindex1 = header.indexOf('Win Probability')
        if (page == "updates") {
          hidecol = master_sht.getRange("B44").getDisplayValue()
        }

        try {
          var statuscolor = JSON.parse(master_sht.getRange(2, stindex + 1).getNote())
          var probabcolor = JSON.parse(master_sht.getRange(2, stindex1 + 1).getNote())
        } catch (e) {
          getcolor()
          var statuscolor = JSON.parse(master_sht.getRange(2, stindex + 1).getNote())
          var probabcolor = JSON.parse(master_sht.getRange(2, stindex1 + 1).getNote())
        }
      }

    }

    if (page == "customer_db" || page == "Inquiries") {
      var username = master_sht.getRange('B2').getValue();
      wausers = master_sht.getRange("A95:A104").getValues().filter(function (r) { return r[0] != '' }).join(",").split(",")
      wausers.unshift(username)
    }

    const pipelineSetting = master_sht.getRange("A23:C28").getValues();

    htmlTemplate.data = {
      'delegator': delegator,
      'scripturl': master_sht.getRange('B21').getValue(),
      'useremail': useremail,
      'passwd': passwd,
      'userdata': userdata,
      'task': customerdata,
      'colsize': colsize,
      'filters': filters,
      'datatype': datatype,
      'previousStoreData': values0,
      'color': color,
      'defaultrow': 60,
      'drparr': drparr,
      'boss': boss,
      'company_name': master_sht.getRange('B15').getValue(),
      'logolink': logolink,
      'logohref': logohref,
      'freeze_col': freeze,
      'remtemplate': templates.getDataRange().getValues(),
      'hidecol': hidecol,
      'editcol': editcol,
      'calendata': calendata,
      'ccemail': master_sht.getRange('B6').getValue(),
      'fromemail': master_sht.getRange('B5').getValue(),
      'sendername': master_sht.getRange('B7').getValue(),
      'vcod': c_code,
      'statuscolor': statuscolor,
      'probabcolor': probabcolor,
      'role': role,
      'pswdcol': pswdcol,
      'photcol': photcol,
      'wausers': wausers,
      'boss_report': boss_report,
      'pipeline_setting': pipelineSetting
    }

    var html = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag('viewport', 'width=device-width, initial-scale=1').setFaviconUrl(favicon).setTitle(page);
    return html;
  } else if (page == 'contact') {
    var vcod = e.parameter.vcod
    var sheetlink = master_sht.getRange('B68').getValue()

    var userdata = delegator.filter(function (r) {
      return r[2] == useremail
    })

    var contactdata = tasksht.getDataRange().getDisplayValues().filter(function (r) {
      return r[0] == vcod
    })[0]
    var companyname = contactdata[2]
    var labelData = getLabelData();
    var inquirydata = inquiry_sht.getDataRange().getValues().filter(function (r) {
      return (r[2] == companyname && r[10] == "Order Won") || r[0] == "Inquiry No"
    })

    var allinquirydata = inquiry_sht.getDataRange().getValues().filter(function (r) {
      return r[2] == companyname
    })


    if (sheetlink != "") {
      var ss1 = SpreadsheetApp.openByUrl(sheetlink)
      var archiv_sht = ss1.getSheetByName('Inquiries')
      var ar_data = archiv_sht.getDataRange().getValues()
      var archidata = ar_data.filter(function (r) {
        return r[2] == companyname && r[10] == "Order Won"
      })
      inquirydata = [...inquirydata, ...archidata]
    }

    var docbody = gethtml(page)
    var htmlTemplate = HtmlService.createTemplate(docbody)

    htmlTemplate.data = {
      'delegator': delegator,
      'scripturl': master_sht.getRange('B21').getValue(),
      'useremail': useremail,
      'passwd': passwd,
      'userdata': userdata,
      'boss': boss,
      'contactdata': contactdata,
      'inquirydata': inquirydata,
      'labelData': labelData,
      'rw': e.parameter.rw,
      'addContactUrl': 'https://script.google.com/macros/s/AKfycbxcNZosypR6Pii9k8aMQsEk2_FkaKVw9vgFjmGheYh_02KTASEL7nZ3LkVQbITAwXxMsg/exec',
      'vcod': vcod,
      'allinquirydata': allinquirydata

    }

    var html = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag('viewport', 'width=device-width, initial-scale=1').setFaviconUrl(favicon).setTitle(page);
    return html;
  } else if (page == "cinput" || page == 'New_Enquiry') {
    var docbody = gethtml(page)
    var htmlTemplate = HtmlService.createTemplate(docbody)

    var userdata = delegator.filter(function (r) {
      return r[2] == useremail
    })
    var respdata = []
    try {
      var data = e.parameter.data
      var obj = JSON.parse(data)
      stepnm.forEach(function (head) {
        var res = obj[head]
        if (res == undefined) {
          res = ''
        }
        respdata.push(res)
      })
    } catch (e) {
      stepnm.forEach(function (head) {
        respdata.push('')
      })
    }

    htmlTemplate.logolink = logolink

    htmlTemplate.data = {
      'delegator': delegator,
      'scripturl': master_sht.getRange('B21').getValue(),
      'useremail': useremail,
      'passwd': passwd,
      'userdata': userdata,
      'boss': boss,
      'colName': stepnm,
      'colType': datatype,
      'datatype': filters,
      'drparr': drparr,
      'sheetName': ss.getName(),
      'logo': logolink,
      'lstvcod': tasksht.getRange(tasksht.getLastRow(), 1).getValue(),
      'respdata': respdata,
      'customerdata': [],
      'role': role,
      'dynamic': master_sht.getRange("B20").getValue(),
      'queryString': e.parameter,
      'label': master_sht.getRange("X3:X").getValues().filter((label) => label[0] != "")
    }
    favicon = 'https://pngimg.com/uploads/plus/plus_PNG63.png'
    var html = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag('viewport', 'width=device-width, initial-scale=1').setFaviconUrl(favicon).setTitle(page);
    return html;

  } else if (page == 'updatein') {
    var docbody = gethtml(page)
    var htmlTemplate = HtmlService.createTemplate(docbody)

    if (role == "boss") {
      var userdata = boss.filter(function (r) {
        return r[1] == useremail
      })
    } else {
      var userdata = delegator.filter(function (r) {
        return r[2] == useremail
      })
    }
    if (label == '') {
      label = userdata[0][2]
    }
    var taskno = e.parameter.taskno
    if (taskno == null) {
      taskno = ''
    }
    const calendata = []
    for (var r = 3; r <= delegator.length + 2; r++) {
      if (master_sht.getRange(r, 19).getBackground() == '#00ff00') {
        calendata.push(master_sht.getRange(r, 13).getValue())
      }
    }


    htmlTemplate.logolink = logolink

    htmlTemplate.data = {
      'delegator': delegator,
      'scripturl': master_sht.getRange('B21').getValue(),
      'useremail': useremail,
      'passwd': passwd,
      'userdata': userdata,
      'boss': boss,
      'colName': stepnm,
      'colType': datatype,
      'datatype': filters,
      'drparr': drparr,
      'taskno': taskno,
      'customerdata': [],
      'inquirydata': fetchData('Inquiries', label, 9),
      'taskcolor': master_sht.getRange('B9').getValue(),
      'taskhr': master_sht.getRange('B10').getValue(),
      'fromtm': master_sht.getRange('B13').getDisplayValue(),
      'calendata': calendata
    }
    var html = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag('viewport', 'width=device-width, initial-scale=1').setFaviconUrl(favicon).setTitle(page);
    return html;

  } else if (page == 'allcontact' || page == "domain" || page == "company") {
    var vcod = e.parameter.vcod
    if (role == "boss") {
      var userdata = boss.filter(function (r) {
        return r[1] == useremail
      })
    } else {
      var userdata = delegator.filter(function (r) {
        return r[2] == useremail
      })
    }
    if (role == "") {
      label = userdata[0][2]
    }
    var contactdata = getallcontactdata(label)

    var labelData = getLabelData();

    var docbody = gethtml(page)
    var htmlTemplate = HtmlService.createTemplate(docbody)

    htmlTemplate.data = {
      'delegator': delegator,
      'scripturl': master_sht.getRange('B21').getValue(),
      'company_name': master_sht.getRange('B15').getValue(),
      'useremail': useremail,
      'passwd': passwd,
      'userdata': userdata,
      'boss': boss,
      'contactdata': contactdata,
      'logolink': logolink,
      'logohref': logohref,
      'labelData': labelData,
      'rw': e.parameter.rw,
      'role': role,
      'pswdcol': pswdcol,
      'photcol': photcol,
      'addContactUrl': 'https://script.google.com/macros/s/AKfycbxcNZosypR6Pii9k8aMQsEk2_FkaKVw9vgFjmGheYh_02KTASEL7nZ3LkVQbITAwXxMsg/exec'

    }

    var html = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag('viewport', 'width=device-width, initial-scale=1').setFaviconUrl(favicon).setTitle(page);
    return html;
  }
  else if (page == "map") {
    var docbody = gethtml(page)
    var htmlTemplate = HtmlService.createTemplate(docbody)
    var userdata = delegator.filter(function (r) {
      return r[2] == useremail
    })

    var appname = master_sht.getRange('B56').getValue();
    var bgColor = master_sht.getRange('B60').getValue();
    var fontSize = master_sht.getRange('B59').getValue();
    var fontFamily = master_sht.getRange('B57').getValue();
    var fontColor = master_sht.getRange('B58').getValue();
    var mapZoom = master_sht.getRange('B61').getValue();
    var markerViewHeader = master_sht.getRange('B62').getValue();

    htmlTemplate.appname = appname
    htmlTemplate.logolink = logolink
    htmlTemplate.logohref = logohref
    htmlTemplate.bgColor = bgColor
    htmlTemplate.fontSize = fontSize
    htmlTemplate.fontFamily = fontFamily
    htmlTemplate.fontColor = fontColor
    htmlTemplate.mapZoom = mapZoom
    htmlTemplate.markerViewHeader = markerViewHeader

    var getLastRow = tasksht.getLastRow();

    var allData = tasksht.getDataRange().getDisplayValues();
    var header = [...allData[0]]

    var headerArr = header.map(function (r) {
      return r.toUpperCase()
    })

    var lattcol = headerArr.indexOf('LATITUDE')
    var longcol = headerArr.indexOf('LONGITUDE')
    var addresscol = headerArr.indexOf('ADDRESS')

    var allLong = customer_db.getRange(3, longcol + 1, getLastRow - 2, 1).getDisplayValues();
    var allLat = customer_db.getRange(3, lattcol + 1, getLastRow - 2, 1).getDisplayValues();

    var avgLong = 0;
    for (var i = 0; i < allLong.length; i++) {
      avgLong += +allLong[i];
    }
    avgLong = avgLong / allLong.length;
    console.log(avgLong);

    var avgLat = 0;
    for (var i = 0; i < allLat.length; i++) {
      avgLat += +allLat[i];
    }
    avgLat = avgLat / allLat.length;
    console.log(avgLat);

    htmlTemplate.lattcol = lattcol;
    htmlTemplate.longcol = longcol;
    htmlTemplate.addresscol = addresscol;
    htmlTemplate.avglong = avgLong;
    htmlTemplate.avglet = avgLat;
    htmlTemplate.data = {
      userdata: userdata,
      filters: filters,
      role: role
    }

    var html = htmlTemplate.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).addMetaTag('viewport', 'width=device-width, initial-scale=1').setFaviconUrl(favicon).setTitle(page);
    return html;
  }


}