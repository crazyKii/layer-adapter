## 前言

1.x版本的layer与3.x版本的layer使用方法有极大的差别。新需求需要我们不更改旧版本的写法同样能使用基于3.x的版本。

更重要的说明，见`res文件夹`

###  设计模型图

![设计模型](.\res\img\system.png)

### 适配效果

```javascript
// 1.8的用法
$.layer({ops});
```



```javascript
// 3.1的用法
layer.open({ops});
```



### 适配方案说明

> 一、综述：
>
> ​        1.8 与 3.1相同参数方法未做适配，默认调用layer3.1；
>
> ​       有部分方法或属性，由于3.1与1.8样式上没有兼容，主要体现在图标
>
>  
>
> 二、兼容属性方法【不做适配】 
>
>   3.1 与 1.8相同或兼容, 默认调用layer3.1，其他不兼容方法属性进行适配处理
>
>   基础属性：maxmin 、shadeClose、move 、moveOut、maxWidth、shift、success、zIndex、moveEnd、min、full、restore、end、yes、shift
>
> 相同方法：close、getChildFrame、getFrameIndex
>
>  
>
> 三、3.1更改的内置方法和属性
>
>    基本上适配完成。
>
>  alert()、confirm()、msg()、tips()、load()功能匹配，图标存在差异，3.1的图标不兼容1.8图标
>
>  
>
> ​    
>
> 四、废弃属性和方法
>
> 1） 废弃属性【不适配】【适配成本大】，CNMS没有用到
>
> ​     3.1废弃属性【适配成本大】，CNMS没有用到，不做适配，将走默认空操作
>
> ​        基础属性：bgcolor、moveType、loading、tips
>
> ​          
>
>   2） 废弃属性，CNMS用到
>
> ​     3.1废弃属性，CNMS用到
>
> ​        基础属性：border【不适配】 CNMS去掉1.8默认灰边框，而3.1默认无灰边框，将走默认空操作          
>
> ​                  fadeIn【不适配】 1.8添加此属性，与3.1默认动画效果相同，但是1.8可设置动画持续时间，3.1未找到如何设置
>
> ​                                 
>
> ​     3.1废弃属性【适配】，CNMS用到
>
> ​        基础属性：
>
> iframe【说明】frameborder未匹配，CNMS用到frameborder:0，默认情况下已经是0。
>
> ​                           ps:设置frameborder没效果，网上也没有对应属性，个人推测是程序员造的
>
> ​                   eg:    iframe : {
>
> ​                                             src : "http://www.baidu.com",
>
> ​                                  scrolling : 'auto', 
>
> ​                                  frameborder : '0'                  
>
> ​                          }
>
> ​     
>
> ​              dialog【说明】type未匹配，CNMS用到
>
> ​                   1.8type定义了0-16种类型的图标，3.1与1.8图标不对应
>
> ​                   eg:
>
> ​                         dialog:{
>
> ​                                      type:1,
>
> ​                                           msg:"内容",
>
> ​                                           btns:2,
>
> ​                                           btn:['取消','确定'],
>
> ​                                           yes:function(index){
>
> ​                                                     alert('yes')
>
> ​                                           },
>
> ​                                           no:function(index){
>
> ​                                                     alert('no')
>
> ​                                           }
>
> ​                           }
>
> ​               page 【说明】完全匹配
>
>  
>
> ​               btns 【说明】完全匹配
>
>  
>
> ​               no    说明】完全匹配
>
> ​       3）废弃方法【全部适配】
>
> ​         3.1废弃方法，CNMS用到
>
> ​            close
>
> ​            shift 【说明】针对应用场景进行匹配
>
> ​            eg:
>
> ​                success: function(){
>
> ​                     layer.shift('top'); 
>
> ​                }
>
>  
>
> ​            废弃方法，CNMS未用到
>
> ​             getIndex(index) 
>
> ​             loadClose   loading非私有





