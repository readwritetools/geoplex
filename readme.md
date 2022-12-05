












<figure>
	<img src='/img/tasks/geoplex/geoplex.png' width='100%' />
	<figcaption></figcaption>
</figure>

##### Thematic Earth

# Geoplex

## Spherical triangles covering a globe


<address>
<img src='/img/48x48/rwtools.png' /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2022-01-17>Jan 17, 2022</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The <span class=product>geoplex</span> tool is used to create GIS layers of nested spherical triangles based on a regular icosahedron model of Earth. Vertices, edges, faces, and centroids may be used in any GIS system that reads geojson, ICE, or GFE file formats.</td></tr>
</table>

### Motivation

Tiling the Earth with triangular faces has many uses. The motivation for this
tool is the need to create faces that cover the entire earth, including the
polar regions, with equal area tiles.

### Installation

The <span>geoplex</span> utility uses Node.js. Package installation is done
via NPM.

To install the utility and make it available to your Bash shell, use this
command.

```bash
[user@host]# npm install -g geoplex
```

### Usage

The software is invoked from the command line with:

```bash
[user@host]# geoplex --help

GEOPLEX creates geodetic triangles based on a regular icosahedron model of Earth
usage: geoplex generate [options]
       geoplex convert  [options]

options:
    --terrasect=min,max  minimum and maximum icosahedron cutting depth (from 0 to 6) to include in output files
    --output=     filename to write shapes to
    --geometry=   which type of geometry to generate ['all', 'vertex', 'edge', 'face', 'centroid']
    --accuracy=   digits to use for latitude and longitude coordinates 1 to 6 (1=11km, 2=1100m, 3=110m, 4=11m, 5=1.1m, 6=11cm)
    --format=     which file format to use ['geojson', 'ice', 'icebin', 'gfe', 'gfebin']
                    'geojson' standard geoJSON encoding
                    'ice'     indexed coordinate encoding
                    'icebin'  indexed coordinate encoding binary
                    'gfe'     geographic feature encoding
                    'gfebin'  geographic feature encoding binary
    --properties  which properties to include with each feature
                    'none','all',
                    'uid','parentUID',
                    'longitude','latitude',
                    'terrasect','edgeLength','triangularArea','bias'
                    'neighboringVertices','neighboringEdges','neighboringFaces','enclosingFace','neighboringCentroids',
                    'vertexA','vertexB','vertexC','centroid','face1','face2','face3','face4'
    --topology    print topology relationships
    --statistics  print statistical values
    --verbose     print extra topological and statistical details
    --version
    --help
```

### Output

#### Terrasect depth

The tool generates points, lines and polygons that cover the entire Earth using
nested terrasects. The initial terrasect covers the Earth with 12 vertices, 30
edges, 20 faces, 20 centroids. Each terrasect contains four times as many
spherical triangular faces as its predecessor:

   * terrasect 0 has 20 faces of 21,544,071 km² and 30 edges      of 7,054 km
   * terrasect 1 has 80 faces of  6,093,750 km² and 120 edges     of 3,765 km
   * terrasect 2 has 320 faces of 1,575,750 km² and 480 edges     of 1,914 km
   * terrasect 3 has 1280 faces of  397,341 km² and 1920 edges    of 961 km
   * terrasect 4 has 5120 faces of   99,550 km² and 7680 edges    of 481 km
   * terrasect 5 has 20,480 faces of 24,901 km² and 30,720 edges  of 241 km
   * terrasect 6 has 81,920 faces of  6,226 km² and 122,880 edges of 120 km

#### File formats

The generated output is in any of these GIS shape file formats:

   * geojson - RFC 7946
   * ice - Indexed Coordinate Encoding
   * icebin - Indexed Coordinate Encoding binary
   * gfe - Geographic Feature Encoding
   * gfebin - Geographic Feature Encoding binary

### Metadata

#### Dependencies

This library depends on <a href='https://www.npmjs.com/package/iolib'>iolib</a>
, <a href='https://www.npmjs.com/package/softlib'>softlib</a>
, <a href='https://www.npmjs.com/package/gcslib'>gcslib</a>
, and <a href='https://www.npmjs.com/package/gcsio'>gcsio</a>
.

#### Module exports


<table>
	<tr><td>ES modules</td> 		<td>true</td></tr>
	<tr><td>Common JS</td> 		<td>false</td></tr>
</table>

#### Suitability


<table>
	<tr><td>Browser</td> 			<td>none</td></tr>
	<tr><td>node.js</td> 			<td>CLI and API</td></tr>
</table>

#### Availability


<table>
	<tr><td><img src='/img/48x48/read-write-hub.png' alt='Read Write Hub logo' width=48 /></td>	<td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/tasks/geoplex.blue'>Read Write Hub</a></td></tr>
	<tr><td><img src='/img/48x48/git.png' alt='git logo' width=48 /></td>	<td>Source code</td> 			<td><a href='https://github.com/readwritetools/geoplex'>github</a></td></tr>
	<tr><td><img src='/img/48x48/npm.png' alt='npm logo' width=48 /></td>	<td>Package installation</td> <td><a href='https://www.npmjs.com/package/geoplex'>npm</a></td></tr>
</table>

#### License

The <span>geoplex</span> library is not freeware. After evaluating it and
before using it in a public-facing website, eBook, mobile app, or desktop
application, you must obtain a license from <a href='https://readwritetools.com/licensing.blue'>Read Write Tools</a>
as part of the <a href='https://hub.readwritetools.com/components/thematic-earth.blue'>thematic-earth</a>
DOM Component.

<img src='/img/blue-seal-premium-software.png' width=80 align=right />

<details>
	<summary>Thematic Earth Software License Agreement</summary>
	<p>Copyright © 2022 Read Write Tools.</p>
	<ol>
		<li>This Software License Agreement ("Agreement") is a legal contract between you and Read Write Tools ("RWT"). The "Materials" subject to this Agreement include the "Thematic Earth" software and associated documentation.</li>
		<li>By using these Materials, you agree to abide by the terms and conditions of this Agreement.</li>
		<li>The Materials are protected by United States copyright law, and international treaties on intellectual property rights. The Materials are licensed, not sold to you, and can only be used in accordance with the terms of this Agreement. RWT is and remains the owner of all titles, rights and interests in the Materials, and RWT reserves all rights not specifically granted under this Agreement.</li>
		<li>Subject to the terms of this Agreement, RWT hereby grants to you a limited, non-exclusive license to use the Materials subject to the following conditions:</li>
		<ul>
			<li>You may not distribute, publish, sub-license, sell, rent, or lease the Materials.</li>
			<li>You may not decompile or reverse engineer any source code included in the software.</li>
			<li>You may not modify or extend any source code included in the software.</li>
			<li>Your license to use the software is limited to the purpose for which it was originally intended, and does not include permission to extract, link to, or use parts on a separate basis.</li>
		</ul>
		<li>Each paid license allows use of the Materials under one "Fair Use Setting". Separate usage requires the purchase of a separate license. Fair Use Settings include, but are not limited to: eBooks, mobile apps, desktop applications and websites. The determination of a Fair Use Setting is made at the sole discretion of RWT. For example, and not by way of limitation, a Fair Use Setting may be one of these:</li>
		<ul>
			<li>An eBook published under a single title and author.</li>
			<li>A mobile app for distribution under a single app name.</li>
			<li>A desktop application published under a single application name.</li>
			<li>A website published under a single domain name. For this purpose, and by way of example, the domain names "alpha.example.com" and "beta.example.com" are considered to be separate websites.</li>
			<li>A load-balanced collection of web servers, used to provide access to a single website under a single domain name.</li>
		</ul>
		<li>THE MATERIALS ARE PROVIDED BY READ WRITE TOOLS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL READ WRITE TOOLS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</li>
		<li>This license is effective for a one year period from the date of purchase or until terminated by you or Read Write Tools. Continued use, publication, or distribution of the Materials after the one year period, under any of this Agreement's Fair Use Settings, is subject to the renewal of this license.</li>
		<li>Products or services that you sell to third parties, during the valid license period of this Agreement and in compliance with the Fair Use Settings provision, may continue to be used by third parties after the effective period of your license.</li>
		<li>If you decide not to renew this license, you must remove the software from any eBook, mobile app, desktop application, web page or other product or service where it is being used.</li>
		<li>Without prejudice to any other rights, RWT may terminate your right to use the Materials if you fail to comply with the terms of this Agreement. In such event, you shall uninstall and delete all copies of the Materials.</li>
		<li>This Agreement is governed by and interpreted in accordance with the laws of the State of California. If for any reason a court of competent jurisdiction finds any provision of the Agreement to be unenforceable, that provision will be enforced to the maximum extent possible to effectuate the intent of the parties and the remainder of the Agreement shall continue in full force and effect.</li>
	</ol>
</details>

