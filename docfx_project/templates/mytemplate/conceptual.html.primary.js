// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE file in the project root for full license information.

var common = require('./common.js');
var extension = require('./conceptual.extension.js')

exports.transform = function (model) {
  if (extension && extension.preTransform) {
    model = extension.preTransform(model);
  }

  model._disableToc = model._disableToc || !model._tocPath || (model._navPath === model._tocPath);
  model.docurl = model.docurl || common.getImproveTheDocHref(model, model._gitContribute, model._gitUrlPattern);

  // Collect up to # anchor char, which causes downstream problems
  // Also remove final / separator if # exists

  var pos = model.docurl && model.docurl.indexOf('#');

  if (pos > 0) {
    if (model.docurl.charAt(pos-1) === '/') {
      --pos;
    }
  }

  model.cleanDocUrl = pos < 0 ? model.docurl : model.docurl.substring(0, pos);

  // Replace "{{doc.xyz}} tokens with xyz metadata value in document
  // Unfortunately DocFx doesn't seem to support this agnostic syntax:
  // const reToken = /{{doc\.(.*)}}/g;
  // model.issueBody =  model.issueBody.replace(reToken, '$1');

  // So we're stuck with naming the tokens explicitly, for example;
  // var reToken = /{{doc\.title}}/gi;
  // model.issueTitle =  model.issueTitle.replace(reToken, model.title);
  // model.issueBody =  model.issueBody.replace(reToken, model.title);

  // Inject the cleanDocUrl into title or body, if specified in title or body template
  // Note that replaceAll() is not supported.

  // Order of replacement is important: largest items first
  model.issueLink = model.issueLink && model.issueLink.replace(/{{issueTitle}}/gi, model.issueTitle);
  model.issueLink = model.issueLink && model.issueLink.replace(/{{issueBody}}/gi, model.issueBody);
  model.issueLink = model.issueLink && model.issueLink.replace(/{{issueDocUrl}}/gi, model.cleanDocUrl);
  model.issueLink = model.issueLink && model.issueLink.replace(/{{doc\.title}}/gi, model.title);


  if (extension && extension.postTransform) {
    model = extension.postTransform(model);
  }

  return model;
}