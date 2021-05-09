import Vue from 'vue'
import { Button, MessageBox, RadioGroup } from 'element-ui'
import { Container } from 'element-ui'
import { Header } from 'element-ui'
import { Main } from 'element-ui'
import { Aside } from 'element-ui'
import { Row } from 'element-ui'
import { Col } from 'element-ui'
import { Menu } from 'element-ui'
import { MenuItem } from 'element-ui'
import { Submenu } from 'element-ui'
import { Drawer } from 'element-ui'
import { Card } from 'element-ui'
import { Form } from 'element-ui'
import { FormItem } from 'element-ui'
import { Input } from 'element-ui'
import { Table } from 'element-ui'
import { TableColumn } from 'element-ui'
import { Breadcrumb } from 'element-ui'
import { BreadcrumbItem } from 'element-ui'
import { Pagination } from 'element-ui'
import { Select } from 'element-ui'
import { Option } from 'element-ui'
import { Dialog } from 'element-ui'
import { RadioButton } from 'element-ui'
import { ColorPicker } from 'element-ui'

Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Drawer)
Vue.use(Card)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Pagination)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(ColorPicker)

//$confirm是可以任意命名的
//将MessageBox组件挂载到Vue实例的原型上，$confirm就变成了原型上的一个自定义属性了，这样每个组件就能通过this.$confirm的方式使用MessageBox确认消息弹框组件
Vue.prototype.$confirm = MessageBox.confirm