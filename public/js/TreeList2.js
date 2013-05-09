// Generated by CoffeeScript 1.6.1
(function() {
  var TreeList2;

  TreeList2 = (function() {

    function TreeList2(containerNode, dataSource) {
      var treeNodes,
        _this = this;
      this.containerNode = containerNode;
      this.dataSource = dataSource != null ? dataSource : null;
      this.editingItem = null;
      $(this.containerNode).addClass("treeList");
      $(this.containerNode).on("mouseenter", "li div", function(event) {
        if ($(this) !== this.editingItem) {
          return $(this).addClass('treeListItemOver');
        }
      });
      $(this.containerNode).on("mouseleave", "li div", function(event) {
        if ($(this) !== this.editingItem) {
          return $(this).removeClass('treeListItemOver');
        }
      });
      $(this.containerNode).on("click", "span.review", function(event) {
        var t, updateEvent;
        t = $(event.target);
        t.parent().removeClass('treeListItemOver').addClass('treeListItemSelected');
        if (_this.editingItem) {
          _this.editingItem.parent().removeClass('treeListItemSelected');
          _this.editingItem.show();
        }
        _this.editingItem = t;
        updateEvent = jQuery.Event("review");
        updateEvent["itemId"] = t.parent().attr('id');
        return $(_this.containerNode).trigger(updateEvent);
      });
      treeNodes = {};
      $(this.containerNode).on("click", "li i.icon-plus-sign", function(event) {
        var name;
        event.stopImmediatePropagation();
        $(this).addClass('icon-minus-sign').removeClass('icon-plus-sign');
        name = $(this).parent().parent().attr("id");
        $("#" + name).append(treeNodes[name]);
        return delete treeNodes[name];
      });
      $(this.containerNode).on("click", "li i.icon-minus-sign", function(event) {
        var name;
        event.stopImmediatePropagation();
        $(this).addClass('icon-plus-sign').removeClass('icon-minus-sign');
        name = $(this).parent().parent().attr("id");
        return treeNodes[name] = $(this).parent().next().detach();
      });
    }

    TreeList2.prototype.show = function(dataSource) {
      this.dataSource = dataSource;
      $(this.containerNode).empty();
      return this.renderTree(this.containerNode, this.getDepartTreeData());
    };

    TreeList2.prototype.showEditingItem = function() {
      if (!this.editingItem) {
        return;
      }
      console.log(this.editingItem);
      this.editingItem.parent().removeClass('treeListItemSelected');
      this.editingItem.show();
      return this.editingItem = null;
    };

    TreeList2.prototype.getEditingItemId = function() {
      if (!this.editingItem) {
        return null;
      }
      return this.editingItem.parent().attr('id');
    };

    TreeList2.prototype.renderTree = function(node, data) {
      var linode, newnode, newnode2, value, _i, _len, _ref;
      $(node).append("<ul></ul>");
      newnode = "" + node + " ul:first";
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        value = data[_i];
        if ((_ref = value.node) == null) {
          value.node = 0;
        }
        linode = "<li id='" + value.id + "node" + value.node + "'><div id='" + value.id + "' class='page'><span class='nodename'>" + value.label + "</span><span class='review btn btn-warning'>查看</span></div></div></li>";
        if (value.node === 1) {
          linode = "<li id='" + value.id + "node" + value.node + "'><div id='" + value.id + "' class='node'><i class='icon-minus-sign' /><span class='nodename'>" + value.label + "</span></div></div></li>";
        }
        $(newnode).append(linode);
        newnode2 = "" + newnode + " #" + value.id + "node" + value.node;
        if (value.children) {
          this.renderTree(newnode2, value.children);
        }
      }
      return null;
    };

    TreeList2.prototype.getDepartTreeData = function() {
      var departs, findChidren, node, rootnode, treeData, value, _i, _j, _len, _len1;
      departs = this.dataSource;
      console.log(departs);
      treeData = [];
      for (_i = 0, _len = departs.length; _i < _len; _i++) {
        value = departs[_i];
        rootnode = {
          label: value.name,
          id: value.id
        };
        if (!value.pid) {
          treeData.push(rootnode);
        }
      }
      findChidren = function(node, departs) {
        var childNode, _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = departs.length; _j < _len1; _j++) {
          value = departs[_j];
          if (value.pid === node.id) {
            if (!node.children) {
              node.children = [];
            }
            childNode = {
              label: value.name,
              id: value.id
            };
            node.children.push(childNode);
            _results.push(findChidren(childNode, departs));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      for (_j = 0, _len1 = treeData.length; _j < _len1; _j++) {
        node = treeData[_j];
        findChidren(node, departs);
      }
      console.log(treeData);
      return treeData;
    };

    return TreeList2;

  })();

  window.TreeList2 = TreeList2;

}).call(this);
