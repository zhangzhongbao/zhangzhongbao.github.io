using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SQLiteCommon
{
    public class AccessData
    {
        public static string GetRouteData(string url)
        {
           
            //构建请求  
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.ContentType = "text/json;chartset=UTF-8";
            //request.UserAgent = "";  
            request.Method = "Get";
            //接收响应  
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream stream = response.GetResponseStream();
            StreamReader streamReader = new StreamReader(stream, Encoding.UTF8);
            string retString = streamReader.ReadToEnd();
            return retString;
            //using (HttpClient client = new HttpClient())
            //{
            //    try
            //    {
            //        var response =await client.GetAsync(url);
            //        if (!response.IsSuccessStatusCode)
            //        {
            //            return "";
            //        }
            //       return await response.Content.ReadAsStringAsync();
            //        //return Task.FromResult<string>(a); 
            //    }
            //    catch (HttpRequestException ex)
            //    {
            //        return "";
            //        //throw new TrackSeriesApiException("", false, ex);
            //    }
            //}
        }
    }
}
