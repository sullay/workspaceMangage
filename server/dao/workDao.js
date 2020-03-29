/*
 * @Description: 数据库交互
 * @Author: 吴文周
 * @Github: https://github.com/fodelf
 * @Date: 2020-03-19 07:31:21
 * @LastEditors: 吴文周
 * @LastEditTime: 2020-03-22 17:33:05
 */
const sd = require('silly-datetime');
const { sqliteDB } = require('../sql/initTable')
async function queryIndexCount(callBack){
  var querySql =` select t1.projectCount,t2.templateCount,t3.componentCount ,t4.utilCount from (select count(*) projectCount from project) t1, (select count(*) templateCount from template) t2 ,(select count(*) componentCount from component) t3,(select count(*) utilCount from util) t4`
  sqliteDB.queryData(querySql, function(data) {
    callBack(data[0])
  })
}

async function queryProjectType(callBack){
  var querySql =`SELECT * from ptype`
  sqliteDB.queryData(querySql, function(data) {
    callBack(data)
  })
}
// 新增项目
async function newProject(data,callBack){
  var tileData = [
    [data.projectName, data.pathUrl,data.gitUrl,data.dec,data.type,data.keyword, sd.format(new Date(), 'YYYY-MM-DD'),0]
  ]
  var insertTileSql = 'insert into project(projectName,pathUrl,gitUrl,dec,type, keyword,creatTime,deleteFlag) values(?, ?, ?,?, ?, ?,?,?)'
  sqliteDB.insertData(insertTileSql, tileData,()=>{
    callBack()
  })
}
// 获取项目列表
async function queryProjectList(data,callBack){
  var type = data.type
  data.pageNum = data.pageNum ? data.pageNum :1
  data.pageSize = data.pageSize? data.pageSize:10
  let n1 = (data.pageNum - 1) * parseInt(data.pageSize);
  let n2 = data.pageSize
  var querySql =`SELECT * ,COUNT(1) OVER() AS total from project  where type ='${type}' and deleteFlag = 0 and keyword  LIKE '%${data.keyword?data.keyword:''}%' LIMIT ${n1},${n2}`
  sqliteDB.queryData(querySql, function(data) {
    callBack(data)
  })
}
// 获取项目汇总
async function queryProjectSum(callBack){
  var querySql =`SELECT type , COUNT(*) as count, label from  project   LEFT JOIN  ptype  ON project.type = ptype.value GROUP BY project.type`
  sqliteDB.queryData(querySql, function(data) {
    callBack(data)
  })
}
module.exports = {
  queryIndexCount,
  queryProjectType,
  newProject,
  queryProjectList,
  queryProjectSum
}