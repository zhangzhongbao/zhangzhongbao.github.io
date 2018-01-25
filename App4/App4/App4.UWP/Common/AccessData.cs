﻿using System;
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
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    var response =client.GetAsync(url).Result;
                    if (!response.IsSuccessStatusCode)
                    {
                        return "";
                    }
                   return response.Content.ReadAsStringAsync().Result;
                    //return Task.FromResult<string>(a); 
                }
                catch (HttpRequestException ex)
                {
                    return "";
                    //throw new TrackSeriesApiException("", false, ex);
                }
            }
        }
    }
}
