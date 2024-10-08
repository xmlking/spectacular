enum Format {
  Vinyl = 'vinyl',
  Cassette = 'cassette',
  Cd = 'cd',
  Download = 'download',
  Streaming = 'streaming',
}

export const formats: Format[] = [Format.Vinyl, Format.Cassette, Format.Cd, Format.Download, Format.Streaming];

export type DataRecord = Record<Format, number> & { year: number };

export type Label = {
  label: string;
  value: number;
  color: string;
};

export function getMaxItems<T extends Record<string, number>>(array: T[], keys: (keyof T)[]): { [key in keyof T]?: T } {
  const maxIndex = (k: keyof T): number => array.reduce((max, curr, i) => (curr[k] > array[max][k] ? i : max), 0);
  const entries = keys.map((key) => [key, array[maxIndex(key)]]);

  return Object.fromEntries(entries);
}

export function getLabels(data: DataRecord[]): Record<number, Label> {
  // map formats to their maximum data records
  const peakItems = getMaxItems(data.slice(0, data.length - 3), formats);

  // place labels at [x,y] where x = peak year and y = area midpoint
  return formats.reduce((obj, format, i) => {
    const offset = Array(i)
      .fill(0)
      .reduce((sum, _, j) => sum + peakItems[format][formats[j]], 0);
    const [x, y] = [peakItems[format].year, offset + peakItems[format][format] / 2];

    obj[x] = {
      label: format === 'cd' ? format.toUpperCase() : format.charAt(0).toUpperCase() + format.slice(1),
      value: y,
      color: 'none',
    };

    return obj;
  }, {});
}

export const data: DataRecord[] = [
  {
    year: 1973,
    vinyl: 1.436,
    cd: 0,
    streaming: 0,
    cassette: 0.5806,
    download: 0,
  },
  {
    year: 1974,
    vinyl: 1.55,
    cd: 0,
    streaming: 0,
    cassette: 0.6497,
    download: 0,
  },
  {
    year: 1975,
    vinyl: 1.6965,
    cd: 0,
    streaming: 0,
    cassette: 0.692,
    download: 0,
  },
  {
    year: 1976,
    vinyl: 1.9081,
    cd: 0,
    streaming: 0,
    cassette: 0.829,
    download: 0,
  },
  {
    year: 1977,
    vinyl: 2.4402,
    cd: 0,
    streaming: 0,
    cassette: 1.0606,
    download: 0,
  },
  {
    year: 1978,
    vinyl: 2.7336,
    cd: 0,
    streaming: 0,
    cassette: 1.3978,
    download: 0,
  },
  {
    year: 1979,
    vinyl: 2.4106,
    cd: 0,
    streaming: 0,
    cassette: 1.2649,
    download: 0,
  },
  {
    year: 1980,
    vinyl: 2.45,
    cd: 0,
    streaming: 0,
    cassette: 1.232,
    download: 0,
  },
  {
    year: 1981,
    vinyl: 2.5981,
    cd: 0,
    streaming: 0,
    cassette: 1.3758,
    download: 0,
  },
  {
    year: 1982,
    vinyl: 2.2081,
    cd: 0,
    streaming: 0,
    cassette: 1.4205,
    download: 0,
  },
  {
    year: 1983,
    vinyl: 1.9583,
    cd: 0.0172,
    streaming: 0,
    cassette: 1.8109,
    download: 0,
  },
  {
    year: 1984,
    vinyl: 1.8475,
    cd: 0.1033,
    streaming: 0,
    cassette: 2.3839,
    download: 0,
  },
  {
    year: 1985,
    vinyl: 1.5615,
    cd: 0.3895,
    streaming: 0,
    cassette: 2.4115,
    download: 0,
  },
  {
    year: 1986,
    vinyl: 1.2111,
    cd: 0.9301,
    streaming: 0,
    cassette: 2.4995,
    download: 0,
  },
  {
    year: 1987,
    vinyl: 0.9964,
    cd: 1.5936,
    streaming: 0,
    cassette: 2.974,
    download: 0,
  },
  {
    year: 1988,
    vinyl: 0.7126,
    cd: 2.0997,
    streaming: 0,
    cassette: 3.4424,
    download: 0,
  },
  {
    year: 1989,
    vinyl: 0.3367,
    cd: 2.7024,
    streaming: 0,
    cassette: 3.5404,
    download: 0,
  },
  {
    year: 1990,
    vinyl: 0.1809,
    cd: 3.6299,
    streaming: 0,
    cassette: 3.7303,
    download: 0,
  },
  {
    year: 1991,
    vinyl: 0.0933,
    cd: 4.4909,
    streaming: 0,
    cassette: 3.25,
    download: 0,
  },
  {
    year: 1992,
    vinyl: 0.0799,
    cd: 5.529,
    streaming: 0,
    cassette: 3.4151,
    download: 0,
  },
  {
    year: 1993,
    vinyl: 0.0618,
    cd: 6.7705,
    streaming: 0,
    cassette: 3.2143,
    download: 0,
  },
  {
    year: 1994,
    vinyl: 0.065,
    cd: 8.7517,
    streaming: 0,
    cassette: 3.2513,
    download: 0,
  },
  {
    year: 1995,
    vinyl: 0.0718,
    cd: 9.7086,
    streaming: 0,
    cassette: 2.5399,
    download: 0,
  },
  {
    year: 1996,
    vinyl: 0.0843,
    cd: 10.3549,
    streaming: 0,
    cassette: 2.0946,
    download: 0,
  },
  {
    year: 1997,
    vinyl: 0.0689,
    cd: 10.5117,
    streaming: 0,
    cassette: 1.6562,
    download: 0,
  },
  {
    year: 1998,
    vinyl: 0.0597,
    cd: 12.1372,
    streaming: 0,
    cassette: 1.5143,
    download: 0,
  },
  {
    year: 1999,
    vinyl: 0.0597,
    cd: 13.4154,
    streaming: 0,
    cassette: 1.1096,
    download: 0,
  },
  {
    year: 2000,
    vinyl: 0.054,
    cd: 13.6391,
    streaming: 0,
    cassette: 0.6306,
    download: 0,
  },
  {
    year: 2001,
    vinyl: 0.0588,
    cd: 13.324,
    streaming: 0,
    cassette: 0.3581,
    download: 0,
  },
  {
    year: 2002,
    vinyl: 0.0454,
    cd: 12.3606,
    streaming: 0,
    cassette: 0.2082,
    download: 0,
  },
  {
    year: 2003,
    vinyl: 0.0432,
    cd: 11.7031,
    streaming: 0,
    cassette: 0.1081,
    download: 0,
  },
  {
    year: 2004,
    vinyl: 0.0392,
    cd: 12.0918,
    streaming: 0.0069,
    cassette: 0.0237,
    download: 0.1835,
  },
  {
    year: 2005,
    vinyl: 0.0274,
    cd: 11.1545,
    streaming: 0.1709,
    cassette: 0.0131,
    download: 0.9243,
  },
  {
    year: 2006,
    vinyl: 0.0256,
    cd: 9.8393,
    streaming: 0.2407,
    cassette: 0.0037,
    download: 1.65,
  },
  {
    year: 2007,
    vinyl: 0.0269,
    cd: 7.9558,
    streaming: 0.272,
    cassette: 0.003,
    download: 2.3924,
  },
  {
    year: 2008,
    vinyl: 0.0596,
    cd: 5.7064,
    streaming: 0.323,
    cassette: 0.0009,
    download: 2.6859,
  },
  {
    year: 2009,
    vinyl: 0.0663,
    cd: 4.5355,
    streaming: 0.3629,
    cassette: 0.0,
    download: 2.66,
  },
  {
    year: 2010,
    vinyl: 0.0912,
    cd: 3.5725,
    streaming: 0.4631,
    cassette: 0.0,
    download: 2.6934,
  },
  {
    year: 2011,
    vinyl: 0.124,
    cd: 3.257,
    streaming: 0.6554,
    cassette: 0.0,
    download: 2.9018,
  },
  {
    year: 2012,
    vinyl: 0.1655,
    cd: 2.607,
    streaming: 1.0362,
    cassette: 0,
    download: 3.0162,
  },
  {
    year: 2013,
    vinyl: 0.2137,
    cd: 2.2501,
    streaming: 1.4608,
    cassette: 0,
    download: 2.9203,
  },
  {
    year: 2014,
    vinyl: 0.2493,
    cd: 1.8725,
    streaming: 1.8352,
    cassette: 0,
    download: 2.5531,
  },
  {
    year: 2015,
    vinyl: 0.3391,
    cd: 1.5231,
    streaming: 2.3421,
    cassette: 0,
    download: 2.3107,
  },
  {
    year: 2016,
    vinyl: 0.3603,
    cd: 1.192,
    streaming: 4.0019,
    cassette: 0,
    download: 1.8294,
  },
  {
    year: 2017,
    vinyl: 0.3946,
    cd: 1.1009,
    streaming: 5.7167,
    cassette: 0,
    download: 1.3853,
  },
  {
    year: 2018,
    vinyl: 0.4245,
    cd: 0.7303,
    streaming: 7.4368,
    cassette: 0,
    download: 1.0173,
  },
  {
    year: 2019,
    vinyl: 0.5044,
    cd: 0.6439,
    streaming: 8.9132,
    cassette: 0,
    download: 0.8326,
  },
];
