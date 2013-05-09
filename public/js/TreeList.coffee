
#树形列表----------------------------------------------------------------------------------
class TreeList

  constructor: (@containerNode, @dataSource=null)->
    @editingItem = null

    $(@containerNode).addClass("treeList")

    $(@containerNode).on("mouseenter", "li div", (event)->
      $(@).addClass('treeListItemOver') unless $(this) == @editingItem)

    $(@containerNode).on("mouseleave", "li div", (event)->
      $(@).removeClass('treeListItemOver') unless $(this) == @editingItem)

    $(@containerNode).on("click", "span.update", (event)=>
       t = $(event.target)
       t.parent().removeClass('treeListItemOver').addClass('treeListItemSelected')
       t.hide();
       if @editingItem
         @editingItem.parent().removeClass('treeListItemSelected')
         @editingItem.show()
       @editingItem = t
       updateEvent = jQuery.Event("update")
       updateEvent["itemId"] = t.parent().attr('id')
       $(@containerNode).trigger(updateEvent))

    $(@containerNode).on("click", "span.delete", (event)=>
      t = $(event.target)
      deleteEvent = jQuery.Event("delete")
      deleteEvent["itemId"] = t.parent().attr('id')
      $(@containerNode).trigger(deleteEvent))

    @treeNodes = {}
    self = @
    $(@containerNode).on("click", "li i.icon-plus-sign", (event)->
      event.stopImmediatePropagation()
      $(@).addClass('icon-minus-sign').removeClass('icon-plus-sign')
      name = $(@).parent().parent().attr("id")
      console.log self.treeNodes[name]
      $("##{name}").append(self.treeNodes[name])
      delete self.treeNodes[name])

    $(@containerNode).on("click", "li i.icon-minus-sign", (event)->
      event.stopImmediatePropagation()
      $(@).addClass('icon-plus-sign').removeClass('icon-minus-sign')
      name = $(@).parent().parent().attr("id")
      self.treeNodes[name] = $(@).parent().next().detach())

  show: (@dataSource)->
    $(@containerNode).empty()
    @renderTree(@containerNode, @getDepartTreeData())

    #收缩的菜单项依旧收缩
    for name, _ of @treeNodes
      ul = $("##{name}").find("ul:first")
      ul.prev().find("i:first").addClass('icon-plus-sign').removeClass('icon-minus-sign')
      @treeNodes[name] = ul.detach()

  showEditingItem: ->
    return unless  @editingItem
    @editingItem.parent().removeClass('treeListItemSelected')
    @editingItem.show()
    @editingItem = null

  getEditingItemId: ->
    return null unless  @editingItem
    @editingItem.parent().attr('id')

  # render a tree
  renderTree: (node, data)->
    $(node).append("<ul></ul>")
    newnode = "#{node} ul:first"
    for value in data
      linode = "<li id='#{value.id}node'><div id='#{value.id}'><span class='nodename'>#{value.label}</span><span class='delete btn btn-danger'>删除</span><span class='update btn btn-warning'>编辑</span></div></li>"
      if value.children
        linode = "<li id='#{value.id}node'><div id='#{value.id}'><i class='icon-minus-sign' /><span class='nodename'>#{value.label}</span><span class='delete btn btn-danger'>删除</span><span class='update btn btn-warning'>编辑</span></div></li>"

      $(newnode).append(linode)
      newnode2 = "#{newnode} ##{value.id}node"
      if value.children
        @renderTree(newnode2, value.children)
    null

  # render a department tree
  getDepartTreeData: ->
    departs = @dataSource
    treeData = []
    for value in departs
      rootnode = {label:value.name, id:value.id};
      treeData.push(rootnode) unless value.pid

    findChidren = (node, departs)->
      for value in departs
        if value.pid == node.id
          node.children = [] unless node.children
          childNode = {label:value.name, id:value.id}
          node.children.push(childNode)
          findChidren(childNode, departs)

    for node in treeData
      findChidren(node, departs)

    treeData

window.TreeList = TreeList