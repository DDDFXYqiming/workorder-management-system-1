import Mock from 'mockjs';

// 模拟延迟
Mock.setup({
  timeout:500
})

// 生成随机数据
Mock.mock('/api/v1/dataSource2',function(){
  return Mock.mock({
    'code':0,
    'msg':'',
    'result':{
      'list|3':[{
        'id|+1': 1,
        'title':'@ctitle',
        "status|1":[0,1,2],
        'current_handler_name': '@cname',
        'dept_name': '@word',
        'create_time': '@time',
      }]
    }
  })
})


