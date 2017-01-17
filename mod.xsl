<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:oxm="https://www.openxsl.com">

    <xsl:template match="/root" name="wurui.mystock-admin">
        <!-- className 'J_OXMod' required  -->
        <div class="J_OXMod oxmod-mystock-admin" ox-mod="mystock-admin" data-uid="{login/uid}" data-dsid="{data/stock-analysis/attribute::ADAPTERID}">
            <div class="searchbar">
                <input type="search" class="J_search" placeholder="input a symbol"/>
            </div>
            <ul>
            <xsl:for-each select="data/stock-analysis/i">
                <li class="rel-list">
                    <button class="bt-del" data-id="{_id}">Delete</button>
                    <xsl:value-of select="symbol"/>
                </li>
            </xsl:for-each>
            </ul>
        </div>
    </xsl:template>

</xsl:stylesheet>
