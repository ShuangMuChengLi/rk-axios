import rkAxios from '../src/index'
describe('rkAxios.get', () => {
  test('get', async () => {
    return await rkAxios.get(
      'https://www.linchaoqun.com/html/cms/content.jsp',
      {
        menu : 'index',
        id: '02b84ae2-b29e-46e6-8b06-2db5c99d3772'
      }
      ).then((res)=>{
        return res
    }).catch((e)=>{
      throw e
    })
  })
  test('setBeforeRequire', (done) => {
    let BeforeRequireCalled = false
    rkAxios.setBeforeRequire(( options, data)=>{
      BeforeRequireCalled = true
      return {data, options}
    })
    rkAxios.get('https://www.linchaoqun.com/html/cms/content.jsp').then(()=>{
      if(BeforeRequireCalled){
        done()
      }
    })
  })

  test('setErrorCallback', (done) => {
    rkAxios.setErrorCallback(()=>{
      done()
    })
    rkAxios.get('https://1')
  })
  test('delete', async () => {
    return await rkAxios.delete(
        'http://218.207.195.169:8762/api-super-map/markInfo/deleteMarkInfo',
        {
          id: '2601120061100000011',
          recordVersion: 0
        }
    ).then((res)=>{
      return res
    }).catch((e)=>{
      throw e
    })
  })
})
