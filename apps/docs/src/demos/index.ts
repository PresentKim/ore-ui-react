import type { Demo } from '../catalog'
import { DEMOS as basic } from '../demos'
import accordion from './accordion'
import boxes from './boxes'
import carousel from './carousel'
import chart from './chart'
import colorpicker from './colorpicker'
import dropdown from './dropdown'
import grid from './grid'
import input from './input'
import keybinds from './keybinds'
import media from './media'
import modal from './modal'
import pagelayout from './pagelayout'
import pagination from './pagination'
import progress from './progress'
import radialmenu from './radialmenu'
import radiogroup from './radiogroup'
import roundedbutton from './roundedbutton'
import scroll from './scroll'
import segment from './segment'
import sizedbox from './sizedbox'
import stepper from './stepper'
import tabs from './tabs'
import textblock from './textblock'
import textslider from './textslider'
import toast from './toast'
import tooltip from './tooltip'
import tutorial from './tutorial'
import twohandleslider from './twohandleslider'
import xyslider from './xyslider'

export const DEMOS: Record<string, Demo> = {
  ...basic,
  ...accordion,
  ...boxes,
  ...carousel,
  ...chart,
  ...colorpicker,
  ...dropdown,
  ...grid,
  ...input,
  ...keybinds,
  ...media,
  ...modal,
  ...pagelayout,
  ...pagination,
  ...progress,
  ...radialmenu,
  ...radiogroup,
  ...roundedbutton,
  ...scroll,
  ...segment,
  ...sizedbox,
  ...stepper,
  ...tabs,
  ...textblock,
  ...textslider,
  ...toast,
  ...tooltip,
  ...tutorial,
  ...twohandleslider,
  ...xyslider,
}
